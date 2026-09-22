import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/http/core";
import { HimoinsaAPI } from "@/http/actions";
import type { Sla, SlaServicePrefill } from "@/types/sla";
import { ShieldCheck } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { Icon } from "../ui/icon";

interface ComJobcardActiveSlasProps {
  customerId: number | null;
  onPrefill: (prefill: SlaServicePrefill) => void;
  selectedServiceId: number | null;
  onSelectService: (id: number | null) => void;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export default function ComJobcardActiveSlas({
  customerId,
  onPrefill,
  selectedServiceId,
  onSelectService,
}: ComJobcardActiveSlasProps) {
  const [slas, setSlas] = useState<Sla[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(false);

  useEffect(() => {
    if (!customerId) {
      setSlas([]);
      return;
    }
    setIsLoading(true);
    apiFetch(`${HimoinsaAPI.api_slas_list}?customer_id=${customerId}`, "GET")
      .then((res) => res.json())
      .then((json: any) => {
        setSlas(
          (json.data ?? []).filter((s: Sla) => s.status === "active")
        );
      })
      .catch(() => setSlas([]))
      .finally(() => setIsLoading(false));
  }, [customerId]);

  useEffect(() => {
    if (!selectedServiceId) return;
    setIsPrefilling(true);
    apiFetch(`${HimoinsaAPI.api_slas_services_prefill}/${selectedServiceId}/prefill`, "GET")
      .then((res) => res.json())
      .then((json: any) => {
        if (json.data) {
          onPrefill(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsPrefilling(false));
  }, [selectedServiceId, onPrefill]);

  const rows = useMemo(() => {
    const result: Array<{
      slaId: number;
      slaRef: string;
      serviceName: string | null;
      serviceId: number | null;
      assetDescription: string | null;
      termEnd: string | null;
    }> = [];
    for (const sla of slas) {
      if (sla.services && sla.services.length > 0) {
        for (const svc of sla.services) {
          result.push({
            slaId: sla.id,
            slaRef: sla.ref,
            serviceName: svc.name,
            serviceId: svc.id,
            assetDescription: null,
            termEnd: sla.term_end ?? null,
          });
        }
      } else {
        result.push({
          slaId: sla.id,
          slaRef: sla.ref,
          serviceName: null,
          serviceId: null,
          assetDescription: null,
          termEnd: sla.term_end ?? null,
        });
      }
    }
    return result;
  }, [slas]);

  if (isLoading) {
    return (
        <View className="py-4 items-center">
          <Spinner size="small" />
          <Text className="text-xs text-text-muted mt-2">Loading SLAs...</Text>
      </View>
    );
  }

  if (rows.length === 0) return null;

  return (
    <View className="mt-4">
      <View className="flex flex-row gap-3 mb-2 items-center justify-items-center">
        <Icon as={ShieldCheck} className="text-accent-primary"/>
        <Text className="text-text text-md font-semibold mb-2">Active SLAs for this customer:</Text>
      </View>
      <ScrollView horizontal={false} className="max-h-48">
        {rows.map((row) => {
          const isSelected = selectedServiceId === row.serviceId;
          const isRowDisabled = !row.serviceId || (selectedServiceId !== null && !isSelected);

          return (
            <Pressable
              key={`${row.slaId}-${row.serviceId}`}
              onPress={() => {
                if (row.serviceId && !isRowDisabled) {
                  onSelectService(isSelected ? null : row.serviceId);
                }
              }}
              disabled={isRowDisabled}
              className={`flex-row items-center gap-2 rounded-full border border-border px-2 py-1.5 mb-4 ${
                isRowDisabled ? "opacity-50" : ""
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
                <Text className="text-xs text-text font-medium">{row.slaRef}</Text>
                {row.serviceName && (
                    <Text className="text-xs text-text-muted">{row.serviceName}</Text>
                )}
              </View>
              {row.termEnd && (
                <Text className="text-xs text-text-muted">
                  Exp: {formatDate(row.termEnd)}
                </Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      {isPrefilling && (
        <View className="flex-row items-center gap-2 mt-2">
          <Spinner size="small" />
          <Text className="text-xs text-text-muted">Prefilling from SLA...</Text>
        </View>
      )}
    </View>
  );
}
