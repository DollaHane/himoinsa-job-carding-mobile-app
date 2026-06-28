import React, { useMemo } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import CardGroup from "@/components/ui/groups/card-group";
import {
  CalendarClock,
  CalendarCheck,
  AlertTriangle,
} from "lucide-react-native";
import type { Jobcard } from "@/types/jobcard";
import { isToday, isTomorrow, isOverdue } from "@/lib/helpers/date-functions";
import ComJobcardListItem from "@/components/page-jobcards/com-jobcard-list-item";

interface ComDashboardJobcardsProps {
  jobcards?: Jobcard[];
  onPress: (id: number) => void;
  maxPerGroup?: number;
}

interface Section {
  title: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  data: Jobcard[];
}

export default function ComDashboardJobcards({
  jobcards = [],
  onPress,
  maxPerGroup = 5,
}: ComDashboardJobcardsProps) {
  const sections = useMemo(() => {
    const today: Jobcard[] = [];
    const tomorrow: Jobcard[] = [];
    const overdue: Jobcard[] = [];

    for (const jc of jobcards) {
      if (isOverdue(jc.scheduled_datetime)) {
        overdue.push(jc);
      } else if (isToday(jc.scheduled_datetime)) {
        today.push(jc);
      } else if (isTomorrow(jc.scheduled_datetime)) {
        tomorrow.push(jc);
      }
    }

    return [
      {
        title: "Today",
        icon: CalendarCheck,
        data: today.slice(0, maxPerGroup),
      },
      {
        title: "Tomorrow",
        icon: CalendarClock,
        data: tomorrow.slice(0, maxPerGroup),
      },
      {
        title: "Overdue",
        icon: AlertTriangle,
        data: overdue.slice(0, maxPerGroup),
      },
    ];
  }, [jobcards, maxPerGroup]);

  return (
    <View className="flex flex-col gap-4">
      {sections.map((section) =>
        section.data.length === 0 ? null : (
          <CardGroup
            key={section.title}
            title={section.title}
            icon={section.icon}
          >
            <View className="flex flex-col gap-2 mt-2">
              {section.data.map((jc) => (
                <Pressable key={jc.id} onPress={() => onPress(jc.id)}>
                  <ComJobcardListItem jobcard={jc} />
                </Pressable>
              ))}
            </View>
          </CardGroup>
        ),
      )}
      {jobcards.length === 0 && (
        <Text className="text-center text-muted-foreground py-8">
          No upcoming jobcards
        </Text>
      )}
    </View>
  );
}
