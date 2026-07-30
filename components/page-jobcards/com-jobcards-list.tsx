import React from "react";
import { FlatList, RefreshControl, Pressable } from "react-native";
import type { Jobcard } from "@/types/jobcard";
import ComJobcardListItem from "./com-jobcard-list-item";
import NoData from "@/components/placeholders/no-data";

interface ComJobcardsListProps {
  jobcards?: Jobcard[];
  onPress: (id: number) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function ComJobcardsList({
  jobcards = [],
  onPress,
  refreshing,
  onRefresh,
}: ComJobcardsListProps) {
  return (
    <FlatList
      data={jobcards}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ gap: 8, paddingBottom: 120 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      ListEmptyComponent={
        <NoData
          data={jobcards.length > 0 ? jobcards : null}
          isLoading={false}
        />
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => onPress(item.id)}>
          <ComJobcardListItem jobcard={item} />
        </Pressable>
      )}
    />
  );
}
