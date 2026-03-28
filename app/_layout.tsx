import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Slot } from "expo-router";
import { Image, View } from "react-native";
import { ReactQueryProvider } from "@/providers/query-client-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import "@/global.css";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  function RootLayoutNav() {
    return (
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    );
  }

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!loaded) {
    return (
      <View className="flex-1">
        <Image
          source={require("../assets/images/himoinsa-splash-screen.png")}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return <RootLayoutNav />;
}

function ThemedApp() {
  const { colorMode } = useTheme();

  return (
    <AuthProvider>
      <ReactQueryProvider>
        <GluestackUIProvider mode={colorMode}>
          <NavigationThemeProvider value={colorMode === "dark" ? DarkTheme : DefaultTheme}>
            <Slot />
          </NavigationThemeProvider>
        </GluestackUIProvider>
      </ReactQueryProvider>
    </AuthProvider>
  );
}
