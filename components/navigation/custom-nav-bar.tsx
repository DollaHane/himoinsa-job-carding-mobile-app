import React from "react";
import { View } from "react-native";
import { usePathname, Href } from "expo-router";

import NavBarItem from "./nav-bar-item";
import { nav_items } from "@/app/tabs/(tabs)/_layout";

export default function CustomNavBar() {
  const pathname = usePathname();

  const isActive = (href: Href) => {
    return pathname === href || pathname.includes(href.split("/").pop() || "");
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
