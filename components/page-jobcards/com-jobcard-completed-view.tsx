import React from "react";
import { View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import CardGroup from "@/components/ui/groups/card-group";
import InfoGroup from "@/components/ui/groups/info-group";
import {
  useGetJobcardSignature,
  useGetJobcardSlotImages,
} from "@/http/services";
import { formatSeconds } from "@/lib/helpers/date-functions";
import type { Jobcard } from "@/types/jobcard";
import { Icon } from "@/components/ui/icon";
import {
  Car,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Boxes,
  Gauge,
  AlertTriangle,
  Lightbulb,
  PenLine,
  Camera,
} from "lucide-react-native";

interface ComJobcardCompletedViewProps {
  jobcard: Jobcard;
}

const SLOTS = ["front", "rear", "left", "right", "fuel"] as const;
type SlotName = (typeof SLOTS)[number];

const slotLabels: Record<SlotName, string> = {
  front: "Front",
  rear: "Rear",
  left: "Left",
  right: "Right",
  fuel: "Fuel",
};

function SignatureView({ jobcard }: { jobcard: Jobcard }) {
  const { data, isLoading } = useGetJobcardSignature(String(jobcard.id));

  if (isLoading) return <Spinner size="small" />;

  const imgUrl = data?.url;

  if (!imgUrl) return <Text className="text-text-muted">No signature</Text>;

  return (
    <Image
      source={{ uri: imgUrl }}
      className="w-full h-40 rounded-md"
      resizeMode="contain"
    />
  );
}

function SlotImagesView({
  jobcard,
  assetId,
}: {
  jobcard: Jobcard;
  assetId: number;
}) {
  const { data, isLoading } = useGetJobcardSlotImages(jobcard.id, assetId);

  if (isLoading) return <Spinner size="small" />;

  const images = data ?? [];

  return (
    <View className="flex flex-row flex-wrap gap-2">
      {SLOTS.map((slot) => {
        const img = images.find((i) => i.slot === slot)?.url;
        return (
          <View key={slot} className="w-[48%] mb-2">
            <Text className="text-xs text-text-muted mb-1">
              {slotLabels[slot]}
            </Text>
            <View className="w-full h-24 rounded-md bg-muted items-center justify-center overflow-hidden">
              {img ? (
                <Image
                  source={{ uri: img }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-text-muted text-xs">—</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function ComJobcardCompletedView({
  jobcard,
}: ComJobcardCompletedViewProps) {
  return (
    <View className="flex flex-col gap-4 pb-4">
      <CardGroup title="Travel" icon={Car}>
        <InfoGroup
          label="Travel Mileage"
          data={
            jobcard.travel_mileage != null
              ? `${jobcard.travel_mileage} km`
              : "—"
          }
          icon={Car}
        />
        <InfoGroup
          label="Travel Time"
          data={formatSeconds(jobcard.travel_time)}
          icon={Car}
        />
      </CardGroup>

      {jobcard.tasks && jobcard.tasks.length > 0 && (
        <CardGroup title="Tasks" icon={ClipboardList}>
          {jobcard.tasks.map((task) => (
            <View key={task.id} className="flex-row items-center gap-2 py-2">
              {task.status === "completed" ? (
                <Icon as={CheckCircle2} size="md" className="text-success" />
              ) : (
                <Icon as={XCircle} size="md" className="text-error" />
              )}
              <View className="flex-1">
                <Text className="text-text">
                  {task.task_step}. {task.description}
                </Text>
                {task.incomplete_reason && (
                  <Text className="text-xs text-text-muted">
                    {task.incomplete_reason}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </CardGroup>
      )}

      {jobcard.inspection_checklists &&
        jobcard.inspection_checklists.length > 0 && (
          <CardGroup title="Inspection Checklists" icon={ClipboardList}>
            {jobcard.inspection_checklists.map((checklist) => (
              <View key={checklist.id} className="mb-3">
                <Text className="text-text font-medium mb-1">
                  {checklist.template_name}
                </Text>
                {checklist.items.map((item) => (
                  <View
                    key={item.step}
                    className="flex-row items-center gap-2 py-1"
                  >
                    {item.checked ? (
                      <Icon as={CheckCircle2} size="sm" className="text-success" />
                    ) : (
                      <Icon as={XCircle} size="sm" className="text-error" />
                    )}
                    <Text className="text-text text-sm flex-1">
                      {item.step}. {item.description}
                    </Text>
                    {item.notes && !item.checked && (
                      <Text className="text-xs text-text-muted">
                        {item.notes}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </CardGroup>
        )}

      {jobcard.inventory && jobcard.inventory.length > 0 && (
        <CardGroup title="Parts Used" icon={Boxes}>
          {jobcard.inventory.map((item) => (
            <View key={item.id} className="flex-row justify-between py-2">
              <Text className="text-text flex-1">
                {item.inventory?.stock_code ?? `Item #${item.inventory_id}`}
              </Text>
              <Text className="text-text">
                {item.quantity_used ?? 0} / {item.quantity_requested}
              </Text>
            </View>
          ))}
        </CardGroup>
      )}

      {jobcard.assets && jobcard.assets.length > 0 && (
        <CardGroup title="SMR Readings" icon={Gauge}>
          {jobcard.assets.map((asset) => (
            <View key={asset.id} className="py-2">
              <Text className="text-text font-medium mb-1">
                {asset.asset?.fleet_number ??
                  asset.asset?.description ??
                  `Asset #${asset.asset_id}`}
              </Text>
              {jobcard.smr_reading && (
                <InfoGroup
                  label="SMR Reading"
                  data={jobcard.smr_reading}
                  icon={Gauge}
                />
              )}
              {jobcard.equipment_condition && (
                <InfoGroup
                  label="Equipment Condition"
                  data={jobcard.equipment_condition}
                  icon={AlertTriangle}
                />
              )}
              {jobcard.recommendations && (
                <InfoGroup
                  label="Recommendations"
                  data={jobcard.recommendations}
                  icon={Lightbulb}
                />
              )}
            </View>
          ))}
        </CardGroup>
      )}

      <CardGroup title="Signature" icon={PenLine}>
        <SignatureView jobcard={jobcard} />
      </CardGroup>

      {jobcard.assets &&
        jobcard.assets.length > 0 &&
        jobcard.assets.map((asset) => (
          <CardGroup
            key={asset.id}
            title={`Photos: ${asset.asset?.fleet_number ?? `Asset #${asset.asset_id}`}`}
            icon={Camera}
          >
            <SlotImagesView jobcard={jobcard} assetId={asset.asset_id} />
          </CardGroup>
        ))}
    </View>
  );
}
