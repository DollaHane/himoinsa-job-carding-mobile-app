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
import { FleetStatus } from "@/components/dashboard/FleetStatus";
import { KvaUtilisationChart } from "@/components/dashboard/KvaUtilisationChart";
import StatCards from "@/components/dashboard/StatCards";
import { useDashboardData } from "@/http/services";
import { DashBoardFilter } from "@/types/dashboard";


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Tickets() {
  
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"open" | "inProgress">("open");
  const isFirstMount = useRef(true);

  const filters: DashBoardFilter = {
    date: '',
    kva: '',
    show_previous: false
  }

  const {data: dashboard_data, isLoading: isDashboardLoading, error, isError} = useDashboardData(filters);

  console.log('chart_data', dashboard_data);

  const scaleOpen = useSharedValue(activeTab === "open" ? 1.05 : 1);
  const scaleInProgress = useSharedValue(activeTab === "inProgress" ? 1.05 : 1);

  const animatedStyleOpen = useAnimatedStyle(() => ({
    transform: [{ scale: scaleOpen.value }],
  }));

  const animatedStyleInProgress = useAnimatedStyle(() => ({
    transform: [{ scale: scaleInProgress.value }],
  }));

  // All useEffect hooks must be called before any conditional returns
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
  }, [activeTab, scaleOpen, scaleInProgress]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

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

  return (
    <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-36">
          <VStack className="mb-6 pt-4" space="xs">
            <Heading className="text-3xl font-bold text-text mb-5">Dashboard</Heading>
          </VStack>
          <VStack className="mb-4 flex gap-4">
            <StatCards/>
            <FleetStatus />
          </VStack>
          <HStack className="mb-4 space-x-4">
            <KvaUtilisationChart />
          </HStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
