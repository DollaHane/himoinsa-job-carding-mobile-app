import { Href } from "expo-router";
import { LayoutDashboard, ClipboardList, User } from "lucide-react-native";
import type React from "react";

export interface NavItem {
  href: Href;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

export const nav_items: NavItem[] = [
  {
    href: `/tabs/dashboard` as Href,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: `/tabs/job-cards` as Href,
    label: "Job Cards",
    icon: ClipboardList,
  },
  {
    href: `/tabs/profile` as Href,
    label: "Profile",
    icon: User,
  },
];
