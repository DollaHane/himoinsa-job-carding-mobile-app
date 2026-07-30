import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/AuthContext";
import { useGetTechnicianShow } from "@/http/services";
import ComTechnicianDetail from "@/components/page-profile/com-technician-detail";
import ComTechnicianStats from "@/components/page-profile/com-technician-stats";
import ComTechnicianChart from "@/components/page-profile/com-technician-chart";
import ErrorScreen from "@/components/placeholders/error-screen";
import ColorPaletteGrid from "@/components/ui/color-pallette-grid";

export default function Profile() {
  const { user } = useAuth();
  const technicianId = user?.technician_id ? String(user.technician_id) : null;

  const { data, isLoading, error, refetch } =
    useGetTechnicianShow(technicianId);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-bold text-text mb-4">Profile</Text>

        <ErrorScreen error={error} refetch={refetch} />

        {data?.technician && (
          <>
            <ComTechnicianDetail technician={data.technician} />
            <View className="my-4">
              <ComTechnicianStats stats={data.stats} />
            </View>
            <ComTechnicianChart monthly={data.stats?.monthly} />
          </>
        )}
        {/* <ColorPaletteGrid /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
