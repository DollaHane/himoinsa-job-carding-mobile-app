import React, { useEffect, useRef } from "react";
import { Link, Href } from "expo-router";
import { View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NavItem {
  href: Href;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

interface NavBarItemProps {
  item: NavItem;
  active: boolean;
}

export default function NavBarItem({ item, active }: NavBarItemProps) {
  const isFirstMount = useRef(true);
  const scale = useSharedValue(active ? 1.1 : 1);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    scale.value = withSpring(active ? 1.1 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const Icon = item.icon;

  return (
    <Link href={item.href} asChild>
      <AnimatedPressable
        className="flex items-center justify-center"
        style={animatedStyle}
      >
        <View
          className={`h-16 w-16 rounded-full flex items-center justify-center ${
            active ? "bg-primary text-white" : "bg-background"
          }`}
        >
          <Icon size={24} color={active ? "#ffffff" : "#767676"} />
        </View>
      </AnimatedPressable>
    </Link>
  );
}
