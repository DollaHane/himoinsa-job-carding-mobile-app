import React, { useState, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, ChevronDown } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useGetJobcardsList, useGetJobcardMetadata } from "@/http/services";
import ComJobcardsList from "@/components/page-jobcards/com-jobcards-list";
import ModCreateQuickJobcard from "@/components/page-dashboard/mod-create-quick-jobcard";
import ErrorScreen from "@/components/placeholders/error-screen";
import { mapToOptions } from "@/lib/helpers/form-options";

export default function JobCards() {
  const { user } = useAuth();
  const router = useRouter();
  const technicianId = user?.technician_id;

  const [search, setSearch] = useState("");
  const [statusId, setStatusId] = useState("");

  const { data: metadata } = useGetJobcardMetadata();
  const statusOptions = useMemo(
    () => [
      { label: "All statuses", value: "" },
      ...mapToOptions(metadata?.statuses ?? [], "name", "id"),
    ],
    [metadata],
  );

  const {
    data: jobcards,
    isLoading,
    error,
    refetch,
  } = useGetJobcardsList({
    technician_id: technicianId ? [technicianId] : null,
    search: search || null,
    status_id: statusId ? [Number(statusId)] : null,
  } as any);

  function handlePress(id: number) {
    router.push(`/tabs/job-cards/${id}` as any);
  }

  function handleSearchChange(text: string) {
    setSearch(text);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-foreground mb-4">
          Job Cards
        </Text>

        <View className="flex flex-row gap-2 mb-3">
          <Input className="flex-1" size="md">
            <InputSlot className="pl-3">
              <InputIcon as={Search} className="text-muted-foreground" />
            </InputSlot>
            <InputField
              placeholder="Search..."
              value={search}
              onChangeText={handleSearchChange}
            />
          </Input>
          <ModCreateQuickJobcard />
        </View>

        <View className="mb-3">
          <Select selectedValue={statusId} onValueChange={setStatusId}>
            <SelectTrigger
              variant="outline"
              size="md"
              className="justify-between"
            >
              <SelectInput placeholder="Filter by status" />
              <SelectIcon className="mr-3" as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        <ErrorScreen error={error} refetch={refetch} />

        <ComJobcardsList
          jobcards={jobcards ?? []}
          onPress={handlePress}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      </View>
    </SafeAreaView>
  );
}
