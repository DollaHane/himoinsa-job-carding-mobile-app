import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from '@/components/ui/menu';
import { Icon } from '@/components/ui/icon';
import { User, FileText, LogOut, Moon, Sun } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function HeaderMenu() {
  const router = useRouter();
  const { logout } = useAuth();
  const { colorMode, toggleColorMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="absolute top-[60px] right-4 z-50">
      <Menu
        className=''
        placement="bottom right"
        offset={5}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable
              {...triggerProps}
              className="w-12 h-12 rounded-full bg-accent-primary items-center justify-center"
            >
              <Icon as={User} size="xl" className="text-white" />
            </Pressable>
          );
        }}
      >
        <MenuItem
          key="Profile"
          textValue="Profile"
          onPress={() => router.push('/tabs/profile')}
        >
          <Icon as={User} size="md" className="mr-2" />
          <MenuItemLabel size="md">Profile</MenuItemLabel>
        </MenuItem>
        <MenuItem
          key="Privacy"
          textValue="Privacy Policy"
          onPress={() => router.push('/tabs/policy')}
        >
          <Icon as={FileText} size="md" className="mr-2" />
          <MenuItemLabel size="md">Privacy Policy</MenuItemLabel>
        </MenuItem>
        <MenuItem
          key="Terms"
          textValue="Terms of Use"
          onPress={() => router.push('/tabs/terms')}
        >
          <Icon as={FileText} size="md" className="mr-2" />
          <MenuItemLabel size="md">Terms of Use</MenuItemLabel>
        </MenuItem>
        <MenuItem
          key="DarkMode"
          textValue="Toggle Dark Mode"
          onPress={toggleColorMode}
        >
          <Icon as={colorMode === 'dark' ? Sun : Moon} size="md" className="mr-2" />
          <MenuItemLabel size="md">
            {colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </MenuItemLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          key="Logout"
          textValue="Logout"
          onPress={handleLogout}
          className='bg-red-500 rounded-xl mt-4'
        >
          <Icon as={LogOut} size="md" className="mr-2 text-white" />
          <MenuItemLabel size="md" className='text-white'>Logout</MenuItemLabel>
        </MenuItem>
      </Menu>
    </View>
  );
}
