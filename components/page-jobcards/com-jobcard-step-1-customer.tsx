import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import {
  Control,
  useWatch,
} from "react-hook-form";
import { Check, Truck } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { FormCombobox } from "@/components/ui/forms/form-combobox";
import { FormSelectDropdown } from "@/components/ui/forms/form-select-dropdown";
import {
  useGetCustomerAssetsByCustomerId,
  useSearchCustomers,
} from "@/http/services";
import { mapToOptions } from "@/lib/helpers/form-options";
import ComJobcardActiveSlas from "./com-jobcard-active-slas";
import ModCreateLocation from "./mod-create-location";
import ModCreateCustomerAsset from "./mod-create-customer-asset";
import AssetLocationSelect from "./com-asset-location-select";
import type { CustomerWithLocations } from "@/types/customer";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";
import type { SlaServicePrefill } from "@/types/sla";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

interface TabStep1CustomerProps {
  control: Control<JobcardCreationRequest>;
  setValue: (name: any, value: any) => void;
  onCustomerChange?: (customer: CustomerWithLocations | null) => void;
}

export default function TabStep1Customer({
  control,
  setValue,
  onCustomerChange,
}: TabStep1CustomerProps) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerWithLocations | null>(null);
  const [selectedSlaServiceId, setSelectedSlaServiceId] = useState<number | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);

  const customerId = useWatch({ control, name: "customer_id" });
  const watchedAssets = useWatch({ control, name: "assets" });

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedCustomerSearch(customerSearch),
      300
    );
    return () => clearTimeout(timer);
  }, [customerSearch]);

  const { data: customersData } = useSearchCustomers(debouncedCustomerSearch);
  const { data: customerAssetsAll, refetch: refetchAssets } =
    useGetCustomerAssetsByCustomerId(customerId ? String(customerId) : "");

  const handleCustomerChange = useCallback(
    (value: string) => {
      const customer = customersData?.find((c) => String(c.id) === value);
      if (customer) {
        setSelectedCustomer(customer);
        onCustomerChange?.(customer);
      }
      if (!value) {
        setSelectedCustomer(null);
        onCustomerChange?.(null);
      }
    },
    [customersData, onCustomerChange]
  );

  const handleSlaPrefill = useCallback(
    (prefill: SlaServicePrefill) => {
      if (prefill.asset_id) {
        // Set the asset via form (replaces current selection)
        control._formValues.assets = [{ asset_id: prefill.asset_id, asset_location_id: undefined }];
      }
    },
    [control]
  );

  const customerOptions = mapToOptions(
    customersData ?? [],
    "company_name",
    "id"
  );

  const locationData = selectedCustomer?.location;

  const customerLocationOptions =
    locationData?.map((loc) => ({
      value: String(loc.id),
      label: loc.name
        ? `${loc.name} — ${loc.address}`
        : loc.address ?? `Location ${loc.id}`,
    })) ?? [];

  // Filter assets based on search
  const filteredAssets = !customerAssetsAll
    ? []
    : !assetSearch
      ? customerAssetsAll
      : customerAssetsAll.filter((a) => {
          const search = assetSearch.toLowerCase();
          return (
            a.fleet_number?.toLowerCase().includes(search) ||
            a.description?.toLowerCase().includes(search) ||
            a.serial_number?.toLowerCase().includes(search)
          );
        });

  // Check if an asset is selected
  const isAssetChecked = (assetId: number) => {
    return (watchedAssets ?? []).some((a: any) => a.asset_id === assetId);
  };

  // Get the index of the selected asset in the assets array
  const getAssetIndex = (assetId: number) => {
    return (watchedAssets ?? []).findIndex((a: any) => a.asset_id === assetId);
  };

  // Toggle asset selection (single-select only)
  const toggleAsset = (assetId: number, checked: boolean) => {
    if (checked) {
      setValue("assets", [{ asset_id: assetId, asset_location_id: undefined }]);
    } else {
      setValue("assets", []);
    }
  };

  const hasCustomer = !!customerId;

  return (
    <View className="flex flex-col gap-5">
      {/* Customer Selection */}
      <FormCombobox
        control={control}
        name="customer_id"
        label="Customer"
        placeholder="Search and select a customer..."
        options={customerOptions}
        onSearch={(value) => setCustomerSearch(value)}
        onChange={handleCustomerChange}
        isRequired
      />

      {/* Customer Location */}
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <FormSelectDropdown
            control={control}
            name="customer_location_id"
            label="Customer Location"
            placeholder={
              !selectedCustomer
                ? "Select a customer first..."
                : customerLocationOptions.length === 0
                  ? "No locations for this customer"
                  : "Select a location..."
            }
            options={customerLocationOptions}
            isDisabled={!selectedCustomer || customerLocationOptions.length === 0}
          />
        </View>
        {selectedCustomer && (
          <Button
            variant="outline"
            size="sm"
            onPress={() => setShowLocationModal(true)}
            className="mt-6"
          >
            <ButtonText className="text-xs">+ New</ButtonText>
          </Button>
        )}
      </View>

      {/* SLA Selection */}
      {customerId && (
        <ComJobcardActiveSlas
          customerId={Number(customerId)}
          onPrefill={handleSlaPrefill}
          selectedServiceId={selectedSlaServiceId}
          onSelectService={setSelectedSlaServiceId}
        />
      )}

      {/* Assets with Selection */}
      <View className="gap-4 pb-20">
        <View className="flex-row items-center justify-between">
          <FieldLabel>Customer Assets</FieldLabel>
          <View className="flex-row gap-2 items-center">
            {!hasCustomer && (
              <Text className="text-xs text-text-muted">
                Select a customer first.
              </Text>
            )}
            {hasCustomer && (watchedAssets ?? []).length === 0 && (
              <Text className="text-xs text-text-muted">
                Select one asset below.
              </Text>
            )}
            {hasCustomer && (
              <Button
                variant="outline"
                size="sm"
                onPress={() => setShowAssetModal(true)}
              >
                <ButtonText className="text-xs">+ New Asset</ButtonText>
              </Button>
            )}
          </View>
        </View>

        {/* Asset Search */}
        {/* {hasCustomer && (
          <View className="relative">
            <Input size="md" className="pl-9">
              <InputField
                placeholder="Search assets..."
                value={assetSearch}
                onChangeText={setAssetSearch}
              />
            </Input>
            <Icon as={Truck} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          </View>
        )} */}

        {/* Asset List with Check Marks */}
        {hasCustomer ? (
          <ScrollView horizontal={false} className="max-h-60">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => {
                const isSelected = isAssetChecked(asset.id);
                const idx = getAssetIndex(asset.id);
                const isDisabled = (watchedAssets ?? []).length > 0 && !isSelected;

                return (
                  <View>
                    <Pressable
                      key={asset.id}
                      onPress={() => {
                        if (!isDisabled) {
                          toggleAsset(asset.id, !isSelected);
                        }
                      }}
                      disabled={isDisabled}
                      className={`flex-row items-center gap-2 rounded-full border border-border px-2 py-1.5 mb-2 ${
                        isDisabled ? "opacity-50" : ""
                      }`}
                    >
                      <View
                        className={cn(
                          "w-8 h-8 rounded-full border items-center justify-center",
                          isSelected
                            ? "bg-accent-primary border-accent-primary"
                            : "border-border bg-background"
                        )}
                      >
                        {isSelected && <Icon as={Check} className="w-3 h-3 text-white" />}
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-text font-medium">
                          {asset.fleet_number || "N/A"} — {asset.description || "No description"}
                        </Text>
                      </View>
                    </Pressable>
                      {isSelected && idx >= 0 && (
                        <View>
                          <AssetLocationSelect
                            control={control}
                            name={`assets.${idx}.asset_location_id`}
                            assetId={asset.id}
                            isFleetJc={false}
                          />
                        </View>
                      )}
                  </View>
                );
              })
            ) : (
              <View className="py-8 items-center">
                <Text className="text-sm text-text-muted">
                  No assets found for this customer.
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View className="py-8 items-center">
            <Text className="text-sm text-text-muted">
              Select a customer first to see available assets.
            </Text>
          </View>
        )}
      </View>

      {/* Inline Creation Modals */}
      {selectedCustomer && (
        <>
          <ModCreateLocation
            customerId={Number(customerId)}
            open={showLocationModal}
            onOpenChange={setShowLocationModal}
            onCreated={(loc) => {
              setSelectedCustomer((prev) =>
                prev ? { ...prev, location: [...(prev.location ?? []), { id: loc.id, name: loc.name, address: "" } as any] } : prev
              );
            }}
          />
          <ModCreateCustomerAsset
            customerId={Number(customerId)}
            open={showAssetModal}
            onOpenChange={setShowAssetModal}
            onCreated={(asset) => {
              refetchAssets();
              setShowAssetModal(false);
            }}
          />
        </>
      )}
    </View>
  );
}
