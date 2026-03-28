import React from 'react'
import { Box } from '../ui/box';
import { Button, ButtonText } from '../ui/button';
import { AlertCircle } from 'lucide-react-native';
import { Text } from '../ui/text';

interface ErrorScreenProps {
  error: Error | null;
  refetch: () => void;
}

export default function ErrorScreen({ error, refetch }: ErrorScreenProps) {
    if (error) {
    return (
      <Box className="flex-1 items-center justify-center p-4">
        <Box className="mb-2">
          <AlertCircle size={48} color="red" />
        </Box>
        <Text className="mb-10">
          Error loading data
        </Text>
        <Button onPress={refetch}>
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    );
  }
}
