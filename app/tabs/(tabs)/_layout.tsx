import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import CustomNavBar from "@/components/navigation/custom-nav-bar";
import { LayoutDashboard, ClipboardList, User } from "lucide-react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

interface TabRoute {
  name: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const routes: Record<string, TabRoute> = {
  dashboard: {
    name: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  job_cards: {
    name: "job-cards",
    label: "Job Cards",
    icon: ClipboardList,
  },
  profile: {
    name: "profile",
    label: "Profile",
    icon: User,
  },
};

export default function TabLayout() {
  return (
    <Tabs
        tabBar={() => <CustomNavBar />}
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      >
        <Tabs.Screen
          name={routes.dashboard.name}
          options={{
            title: routes.dashboard.label,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="dashboard" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name={routes.job_cards.name}
          options={{
            title: routes.job_cards.label,
            tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          }}
        />
        <Tabs.Screen
          name={routes.profile.name}
          options={{
            title: routes.profile.label,
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
  );
}
