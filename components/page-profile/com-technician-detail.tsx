import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import CardGroup from "@/components/ui/groups/card-group";
import InfoGroup from "@/components/ui/groups/info-group";
import type { Technician } from "@/types/technicians";
import { Mail, Phone, Briefcase, Building2, Globe } from "lucide-react-native";

interface ComTechnicianDetailProps {
  technician: Technician;
}

export default function ComTechnicianDetail({
  technician,
}: ComTechnicianDetailProps) {
  const initials = `${technician.first_name?.[0] ?? ""}${technician.last_name?.[0] ?? ""}`;

  return (
    <CardGroup title="Technician" icon={undefined}>
      <View className="flex-row items-center gap-4 mb-4">
        <Avatar size="lg">
          <AvatarFallbackText>{initials}</AvatarFallbackText>
        </Avatar>
        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground">
            {technician.first_name} {technician.last_name}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {technician.position_name ?? technician.position ?? "Technician"}
          </Text>
        </View>
      </View>

      <View className="flex flex-col gap-2">
        <InfoGroup label="Email" data={technician.email} icon={Mail} />
        <InfoGroup
          label="Mobile"
          data={technician.mobile_number}
          icon={Phone}
        />
        <InfoGroup
          label="Position"
          data={technician.position_name}
          icon={Briefcase}
        />
        <InfoGroup
          label="Branch"
          data={technician.branch_name}
          icon={Building2}
        />
        <InfoGroup label="Country" data={technician.country} icon={Globe} />
      </View>
    </CardGroup>
  );
}
