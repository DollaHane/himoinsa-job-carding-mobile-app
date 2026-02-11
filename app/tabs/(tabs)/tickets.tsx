import React, { useState, useEffect, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Ticket } from "@/types/ticket";
import { Pressable } from "react-native";
import { TicketModal } from "@/components/tickets/TicketModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import TicketCard from "@/components/tickets/TicketCard";
import { tickets } from "@/utils/mock-data";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Tickets() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"open" | "inProgress">("open");
  const isFirstMount = useRef(true);

  const scaleOpen = useSharedValue(activeTab === "open" ? 1.05 : 1);
  const scaleInProgress = useSharedValue(activeTab === "inProgress" ? 1.05 : 1);

  const handleOpenModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  // Filter tickets based on active tab
  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "open") {
      return ticket.status === "1"; // Status 1 = Open
    } else {
      return ticket.status === "2"; // Status 2 = In Progress
    }
  });

  // Count tickets by status
  const openCount = tickets.filter((t) => t.status === "1").length;
  const inProgressCount = tickets.filter((t) => t.status === "2").length;

  // Show loading while checking auth
  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text className="text-typography-600">Loading...</Text>
      </Box>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    scaleOpen.value = withSpring(activeTab === "open" ? 1.05 : 1, {
      damping: 15,
      stiffness: 150,
    });
    scaleInProgress.value = withSpring(activeTab === "inProgress" ? 1.05 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeTab]);

  const animatedStyleOpen = useAnimatedStyle(() => ({
    transform: [{ scale: scaleOpen.value }],
  }));

  const animatedStyleInProgress = useAnimatedStyle(() => ({
    transform: [{ scale: scaleInProgress.value }],
  }));

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16">
          <VStack className="mb-6 pt-4" space="xs">
            <Heading className="text-3xl font-bold text-primary-900 dark:text-white mb-5">Support Tickets</Heading>
          </VStack>

          {/* Tab Triggers */}
          <HStack className="mb-6 gap-5 justify-center">
            <AnimatedPressable className="w-32" style={animatedStyleOpen} onPress={() => setActiveTab("open")}>
              <HStack
                className={`items-center justify-between bg-background-0 rounded-full shadow-md shadow-secondary-200 px-3 py-2 ${
                  activeTab === "open" ? "bg-blue-950" : "bg-background-0"
                }`}
              >
                <Text className={`text-[10px] ${activeTab === "open" ? "text-white" : "text-primary-800"}`}>Open</Text>
                <Text className="text-xl font-bold text-red-500">{openCount}</Text>
              </HStack>
            </AnimatedPressable>

            <AnimatedPressable className="w-32" style={animatedStyleInProgress} onPress={() => setActiveTab("inProgress")}>
              <HStack
                className={`items-center justify-between bg-background-0 rounded-full shadow-md shadow-secondary-200 px-3 py-2 ${
                  activeTab === "inProgress" ? "bg-blue-950" : "bg-background-0"
                }`}
              >
                <Text className={`text-[10px] ${activeTab === "inProgress" ? "text-white" : "text-primary-800"}`}>
                  In Progress
                </Text>
                <Text className={`text-xl font-bold text-blue-500`}>{inProgressCount}</Text>
              </HStack>
            </AnimatedPressable>
          </HStack>

          {/* Ticket Cards List */}
          {filteredTickets.length === 0 ? (
            <Box className="bg-background-50 rounded-xl p-6 border border-secondary-300">
              <Text className="text-center text-primary-800">
                No {activeTab === "open" ? "open" : "in progress"} tickets found
              </Text>
            </Box>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                handleOpenModal={handleOpenModal}
              />
            ))
          )}

          {/* Tickets Card Modal */}
          {selectedTicket && (
            <TicketModal
              showModal={showModal}
              setShowModal={setShowModal}
              ticket={selectedTicket}
            />
          )}
        </Box>
      </Center>
    </ScrollView>
  );
}
