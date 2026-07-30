import React from 'react';
import { Link, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Center } from '@/components/ui/center';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Center className="flex-1">
        <Text className="text-secondary">This screen doesn't exist.</Text>
        <Link href="/" style={{ marginTop: 10 }}>
          <Text className="text-primary">Go to home screen!</Text>
        </Link>
      </Center>
    </>
  );
}
