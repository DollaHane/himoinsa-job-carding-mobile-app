import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Href } from "expo-router";
import CustomNavBar from "@/components/navigation/custom-nav-bar";
import HeaderMenu from "@/components/navigation/header-menu";
import { Ticket, Plus, User, FileText, Zap, HandCoins } from "lucide-react-native";

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) {
  return (
    <FontAwesome
      size={18}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

interface Routes {
  name: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

interface NavItem {
  href: Href;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const routes: Record<string, Routes> = {
  tickets: {
    name: "tickets",
    label: "Tickets",
    icon: Zap,
  },
  create_tickets: {
    name: "createticketform",
    label: "Create Ticket",
    icon: HandCoins,
  },
  profile: {
    name: "profile",
    label: "Profile",
    icon: User,
  },
  policy: {
    name: "policy",
    label: "Privacy Policy",
    icon: FileText,
  },
  terms: {
    name: "terms",
    label: "Terms of Use",
    icon: FileText,
  },
};

export const nav_items: NavItem[] = [
  {
    href: `/tabs/${routes.tickets.name}` as Href,
    label: routes.tickets.label,
    icon: routes.tickets.icon,
  },
  {
    href: `/tabs/${routes.create_tickets.name}` as Href,
    label: routes.create_tickets.label,
    icon: routes.create_tickets.icon,
  },
];

export default function TabLayout() {
  return (
    <>
      <HeaderMenu />
      <Tabs
        tabBar={(props) => <CustomNavBar />}
        screenOptions={{
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: false,
          animation: "shift",
        }}
      >
        <Tabs.Screen
          name={routes.tickets.name}
          options={{
            title: routes.tickets.label,
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="star-o"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={routes.create_tickets.name}
          options={{
            title: routes.create_tickets.label,
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="star-o"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={routes.profile.name}
          options={{
            title: routes.profile.label,
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="star-o"
                color={color}
              />
            ),
            href: null, 
          }}
        />
        <Tabs.Screen
          name={routes.policy.name}
          options={{
            title: routes.policy.label,
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="star-o"
                color={color}
              />
            ),
            href: null, 
          }}
        />
        <Tabs.Screen
          name={routes.terms.name}
          options={{
            title: routes.terms.label,
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name="star-o"
                color={color}
              />
            ),
            href: null, 
          }}
        />
      </Tabs>
    </>
  );
}
