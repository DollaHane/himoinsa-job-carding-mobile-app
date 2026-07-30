import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import {
  Control,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Plus } from "lucide-react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FieldLabel } from "@/components/ui/field";
import { FormCombobox } from "@/components/ui/forms/form-combobox";
import { FormSelectDropdown } from "@/components/ui/forms/form-select-dropdown";
import {
  useGetCustomerAssetsByCustomerId,
  useSearchCustomers,
} from "@/http/services";
import { mapToOptions } from "@/lib/helpers/form-options";
import ComAssetRow from "./com-asset-row";
import type { CustomerWithLocations } from "@/types/customer";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";

interface TabStep1CustomerProps {
  control: Control<JobcardCreationRequest>;
  onCustomerChange?: (customer: CustomerWithLocations | null) => void;
}

export default function TabStep1Customer({
  control,
  onCustomerChange,
}: TabStep1CustomerProps) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState("");
  const [debouncedAssetSearch, setDebouncedAssetSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerWithLocations | null>(null);

  const customerId = useWatch({ control, name: "customer_id" });
  const watchedAssets = useWatch({ control, name: "assets" });

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({ control, name: "assets" });

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedCustomerSearch(customerSearch),
      300
    );
    return () => clearTimeout(timer);
  }, [customerSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedAssetSearch(assetSearch), 300);
    return () => clearTimeout(timer);
  }, [assetSearch]);

  const { data: customersData } = useSearchCustomers(debouncedCustomerSearch);
  const { data: customerAssetsAll } = useGetCustomerAssetsByCustomerId(
    customerId ? String(customerId) : ""
  );

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

  const assetsData = !customerAssetsAll
    ? undefined
    : !debouncedAssetSearch
      ? customerAssetsAll
      : customerAssetsAll.filter((a) => {
          const search = debouncedAssetSearch.toLowerCase();
          return (
            a.fleet_number?.toLowerCase().includes(search) ||
            a.description?.toLowerCase().includes(search) ||
            a.serial_number?.toLowerCase().includes(search)
          );
        });

  const assetOptions =
    assetsData?.map((asset) => ({
      value: String(asset.id),
      label: [
        asset.fleet_number ?? "N/A",
        asset.description ?? "No description",
        asset.serial_number ? `(${asset.serial_number})` : "",
      ]
        .filter(Boolean)
        .join(" — "),
    })) ?? [];

  const handleAddAsset = useCallback(() => {
    appendAsset({ asset_id: 0, asset_location_id: 0 });
  }, [appendAsset]);

  return (
    <View className="flex flex-col gap-5">
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

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <FieldLabel>Assets</FieldLabel>
          <Button variant="outline" size="sm" onPress={handleAddAsset}>
            <ButtonIcon as={Plus} className="mr-1 h-3 w-3" />
            <ButtonText>Add Asset</ButtonText>
          </Button>
        </View>

        {assetFields.length === 0 && (
          <Text className="text-sm text-text-muted">
            No assets added. Click &ldquo;Add Asset&rdquo; to select at least
            one asset.
          </Text>
        )}

        {assetFields.map((field, i) => (
          <ComAssetRow
            key={field.id}
            control={control}
            index={i}
            assetOptions={assetOptions}
            assetId={Number(watchedAssets?.[i]?.asset_id) || null}
            isFleetJc={false}
            onSearch={setAssetSearch}
            onRemove={() => removeAsset(i)}
          />
        ))}
      </View>
    </View>
  );
}
