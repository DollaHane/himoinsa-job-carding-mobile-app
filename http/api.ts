import * as SecureStore from 'expo-secure-store';

export const domain = process.env.EXPO_PUBLIC_API_URL || 'https://na-itsm.cloudx.net.za/';
export const auth_token = process.env.EXPO_PUBLIC_API_AUTH_TOKEN || '';
export const get_ticket = 'api/tickets/';
export const post_ticket = 'api/tickets/';
export const get_ticket_search = 'api/tickets/search/';
export const post_login = 'api/contacts/login/';

// Helper to get the current user's API token
export async function getUserApiToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('api_token');
  } catch (error) {
    console.error('Error getting user API token:', error);
    return null;
  }
}