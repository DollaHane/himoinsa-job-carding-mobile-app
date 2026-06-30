import { Stack } from "expo-router";

export default function CreateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="customer" />
      <Stack.Screen name="fleet" />
    </Stack>
  );
}
