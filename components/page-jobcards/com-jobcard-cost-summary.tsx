import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Pencil } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { useGetSettings } from "@/http/services";
import { HimoinsaAPI } from "@/http/actions";
import { useMutationHandler } from "@/hooks/mutation";
import { QueryKeys } from "@/http/services";
import CardGroup from "@/components/ui/groups/card-group";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import type { Jobcard } from "@/types/jobcard";

function formatCurrency(value: number): string {
  return `R ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

interface JobcardCostSummaryProps {
  jobcard: Jobcard;
}

export default function JobcardCostSummary({ jobcard }: JobcardCostSummaryProps) {
  const { data: settings } = useGetSettings();

  const labourRate = Number(jobcard.labour_rate ?? settings?.labour_rate ?? 0);
  const travelRate = Number(jobcard.travel_rate ?? settings?.travel_rate ?? 0);

  const inventory = (jobcard.inventory ?? []) as Array<{
    unit_price?: number | string | null;
    quantity_requested?: number | string | null;
    quantity_used?: number | string | null;
    inventory?: { stock_code?: string | null; description?: string | null } | null;
  }>;

  const timers = jobcard.timers ?? [];
  const tasks = jobcard.tasks ?? [];

  const estimatedTaskHours =
    tasks.reduce((sum: number, t: any) => sum + Number(t.duration ?? 0), 0) / 3600;
  const actualTimerHours = timers.reduce((sum: number, t: any) => {
    if (!t.start_time || !t.end_time) return sum;
    return sum + (Number(t.end_time) - Number(t.start_time)) / 3600;
  }, 0);
  const labourProjected = estimatedTaskHours * labourRate;
  const labourActual = actualTimerHours * labourRate;

  const travelMileage = Number(jobcard.travel_mileage ?? 0);
  const travel = travelMileage * travelRate;

  const inventoryProjected = inventory.reduce(
    (sum: number, item: any) => sum + Number(item.unit_price ?? 0) * Number(item.quantity_requested),
    0
  );
  const inventoryActual = inventory.reduce(
    (sum: number, item: any) => sum + Number(item.unit_price ?? 0) * Number(item.quantity_used),
    0
  );

  const projectedTotal = inventoryProjected + labourProjected + travel;
  const actualTotal = inventoryActual + labourActual + travel;

  const [editingTravel, setEditingTravel] = useState(false);
  const [travelMileageInput, setTravelMileageInput] = useState(
    jobcard.travel_mileage != null ? String(jobcard.travel_mileage) : ""
  );
  const [travelRateInput, setTravelRateInput] = useState(
    jobcard.travel_rate != null ? String(jobcard.travel_rate) : String(travelRate)
  );

  const [editingLabour, setEditingLabour] = useState(false);
  const [labourRateInput, setLabourRateInput] = useState(
    jobcard.labour_rate != null ? String(jobcard.labour_rate) : String(labourRate)
  );

  const { handleMutation: saveCost, isPending: isSaving } = useMutationHandler({
    route: `${HimoinsaAPI.api_jobcards_update}/${jobcard.id}`,
    method: "PUT",
    success_message: "Cost updated.",
    query_keys: [QueryKeys.jobcards_show(String(jobcard.id))],
  });

  return (
    <CardGroup title="Cost">
      <View className="space-y-3">
        {/* Inventory rows */}
        {inventory.map((item: any, i: number) => {
          const unitPrice = Number(item.unit_price ?? 0);
          const projected = unitPrice * Number(item.quantity_requested);
          const actual = unitPrice * Number(item.quantity_used);
          const diff = actual - projected;
          const label = item.inventory
            ? [item.inventory.stock_code, item.inventory.description].filter(Boolean).join(" - ") || `Inventory #${item.inventory.id}`
            : "N/A";
          return (
            <View key={i} className="flex-row justify-between py-1 border-b border-border">
              <View className="flex-1">
                <Text className="text-sm">{label}</Text>
                <Text className="text-xs text-text-muted">
                  {formatCurrency(unitPrice)} × {Number(item.quantity_requested).toFixed(2)} req / {Number(item.quantity_used).toFixed(2)} used
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm">{formatCurrency(projected)}</Text>
                <Text className="text-xs text-text-muted">Actual: {formatCurrency(actual)}</Text>
                <Text className={cn("text-xs", diff > 0 ? "text-error" : diff < 0 ? "text-success" : "")}>
                  {diff > 0 ? "+" : ""}{formatCurrency(diff)}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Labour row */}
        <View className="flex-row justify-between py-1 border-b border-border">
          <View className="flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm">Labour</Text>
              <Pressable onPress={() => setEditingLabour(!editingLabour)}>
                <Pencil className="h-3 w-3 text-text-muted" />
              </Pressable>
            </View>
            {editingLabour ? (
              <View className="flex-row items-center gap-2 mt-1">
                <Input size="sm" className="w-24">
                  <InputField
                    keyboardType="numeric"
                    value={labourRateInput}
                    onChangeText={setLabourRateInput}
                  />
                </Input>
                <Text className="text-xs text-text-muted">R/hr</Text>
                <Button size="sm" onPress={() => {
                  saveCost({ labour_rate: Number(labourRateInput) || null });
                  setEditingLabour(false);
                }} disabled={isSaving}>
                  <ButtonText className="text-xs">Save</ButtonText>
                </Button>
              </View>
            ) : (
              <Text className="text-xs text-text-muted">{formatCurrency(labourRate)} / hour</Text>
            )}
          </View>
          <View className="items-end">
            <Text className="text-sm">{estimatedTaskHours.toFixed(2)} hrs req / {actualTimerHours.toFixed(2)} hrs used</Text>
            <Text className="text-sm">{formatCurrency(labourProjected)}</Text>
            <Text className="text-xs text-text-muted">Actual: {formatCurrency(labourActual)}</Text>
          </View>
        </View>

        {/* Travel row */}
        <View className="flex-row justify-between py-1 border-b border-border">
          <View className="flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-sm">Travel</Text>
              <Pressable onPress={() => setEditingTravel(!editingTravel)}>
                <Pencil className="h-3 w-3 text-text-muted" />
              </Pressable>
            </View>
            {editingTravel ? (
              <View className="flex-row items-center gap-2 mt-1">
                <Input size="sm" className="w-20">
                  <InputField
                    keyboardType="numeric"
                    value={travelMileageInput}
                    onChangeText={setTravelMileageInput}
                    placeholder="km"
                  />
                </Input>
                <Input size="sm" className="w-20">
                  <InputField
                    keyboardType="numeric"
                    value={travelRateInput}
                    onChangeText={setTravelRateInput}
                    placeholder="R/km"
                  />
                </Input>
                <Button size="sm" onPress={() => {
                  saveCost({
                    travel_mileage: Number(travelMileageInput) || null,
                    travel_rate: Number(travelRateInput) || null,
                  });
                  setEditingTravel(false);
                }} disabled={isSaving}>
                  <ButtonText className="text-xs">Save</ButtonText>
                </Button>
              </View>
            ) : (
              <Text className="text-xs text-text-muted">{formatCurrency(travelRate)} / km</Text>
            )}
          </View>
          <View className="items-end">
            <Text className="text-sm">{travelMileage.toFixed(1)} km</Text>
            <Text className="text-sm">{formatCurrency(travel)}</Text>
          </View>
        </View>

        {/* Total row */}
        <View className="flex-row justify-between py-2 border-t border-border">
          <Text className="text-sm font-bold">Total</Text>
          <View className="items-end">
            <Text className="text-sm">Projected: {formatCurrency(projectedTotal)}</Text>
            <Text className="text-sm">Actual: {formatCurrency(actualTotal)}</Text>
          </View>
        </View>
      </View>
    </CardGroup>
  );
}
