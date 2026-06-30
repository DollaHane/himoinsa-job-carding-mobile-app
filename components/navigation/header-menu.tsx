import React from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { Icon } from "@/components/ui/icon";
import { User, LogOut, Moon, Sun } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { apiFetch, HimoinsaAPI } from "@/http";

export default function HeaderMenu() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const { colorMode, toggleColorMode } = useTheme();

  const handleLogout = async () => {
    try {
      await apiFetch(HimoinsaAPI.api_logout, "POST");
      await clearSession();
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View className="absolute top-[60px] right-4 z-50">
      <Menu
        placement="bottom right"
        offset={5}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable
              {...triggerProps}
              className="w-12 h-12 rounded-full bg-primary items-center justify-center"
            >
              <Icon as={User} size="xl" className="text-white" />
            </Pressable>
          );
        }}
      >
        <MenuItem
          key="Profile"
          textValue="Profile"
          onPress={() => router.push("/tabs/profile")}
        >
          <Icon as={User} size="md" className="mr-2 text-text" />
          <MenuItemLabel size="md">Profile</MenuItemLabel>
        </MenuItem>
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
