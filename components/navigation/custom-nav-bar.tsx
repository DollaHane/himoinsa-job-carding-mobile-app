import React from "react";
import { View } from "react-native";
import { usePathname, Href } from "expo-router";

import NavBarItem from "./nav-bar-item";
import { nav_items } from "@/constants/nav-items";

export default function CustomNavBar() {
  const pathname = usePathname();

  const isActive = (href: Href) => {
    const hrefStr = typeof href === "string" ? href : href.pathname ?? "";
    return pathname === hrefStr || pathname.includes(hrefStr.split("/").pop() || "");
  };

  return (
    <View className="absolute bottom-0 w-full flex-row items-center justify-evenly bg-transparent pb-8 shadow-lg">
      {nav_items.map((item) => (
        <NavBarItem
          key={item.label}
          item={item}
          active={isActive(item.href)}
        />
      ))}
    </View>
  );
}
