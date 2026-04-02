import { Href } from "expo-router";
import { Zap, HandCoins } from "lucide-react-native";
import type React from "react";

export interface NavItem {
  href: Href;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

export const nav_items: NavItem[] = [
  {
    href: `/tabs/tickets` as Href,
    label: "Tickets",
    icon: Zap,
  },
  {
    href: `/tabs/createticketform` as Href,
    label: "Create Ticket",
    icon: HandCoins,
  },
];
