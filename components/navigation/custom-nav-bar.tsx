import React, { useCallback } from "react";
import { View, Pressable } from "react-native";
import { usePathname, useRouter, Href } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { Icon } from "@/components/ui/icon";
import { Menu as MenuIcon, LogOut, Moon, Sun } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { apiFetch } from "@/http";
import { HimoinsaAPI } from "@/http/actions";

import NavBarItem from "./nav-bar-item";
import { nav_items } from "@/constants/nav-items";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CustomNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearSession } = useAuth();
  const { colorMode, toggleColorMode } = useTheme();

  const isActive = (href: Href) => {
    const hrefStr = typeof href === "string" ? href : (href.pathname ?? "");
    if (pathname === hrefStr) return true;
    const lastSegment = hrefStr.split("/").pop();
    return !!lastSegment && pathname.includes(lastSegment);
  };

  const handleLogout = async () => {
    try {
      await apiFetch(HimoinsaAPI.api_logout, "POST");
      await clearSession();
      router.replace("/");
    } catch (_error) {
      // silently handle
    }
  };

  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 150 });
  }, []);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="absolute bottom-0 w-full flex-row items-center justify-evenly bg-background pb-8 pt-6 shadow-lg">
      {nav_items.map((item) => (
        <NavBarItem key={item.label} item={item} active={isActive(item.href)} />
      ))}
      <Menu
        placement="top"
        offset={5}
        trigger={({ ...triggerProps }) => {
          return (
            <AnimatedPressable
              {...triggerProps}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              className="flex items-center justify-center"
              style={animatedStyle}
            >
              <View className="h-16 w-16 rounded-full bg-background flex items-center justify-center">
                <Icon
                  as={MenuIcon}
                  size="xl"
                  className="text-text"
                />
              </View>
            </AnimatedPressable>
          );
        }}
      >
        <MenuItem
          key="DarkMode"
          textValue="Toggle Dark Mode"
          onPress={toggleColorMode}
        >
          <Icon
            as={colorMode === "dark" ? Sun : Moon}
            size="md"
            className="mr-2 text-text"
          />
          <MenuItemLabel size="md">
            {colorMode === "dark" ? "Light Mode" : "Dark Mode"}
          </MenuItemLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          key="Logout"
          textValue="Logout"
          onPress={handleLogout}
          className="bg-error rounded-xl mt-4"
        >
          <Icon as={LogOut} size="md" className="mr-2 text-white" />
          <MenuItemLabel size="md" className="text-white">
            Logout
          </MenuItemLabel>
        </MenuItem>
      </Menu>
    </View>
  );
}
