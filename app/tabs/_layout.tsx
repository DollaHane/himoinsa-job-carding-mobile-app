export { ErrorBoundary } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
