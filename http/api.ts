import * as SecureStore from 'expo-secure-store';

export const domain = process.env.EXPO_PUBLIC_API_URL || 'https://himoinsa.cloudx.net.za:8001/';
export const auth_token = process.env.EXPO_PUBLIC_API_AUTH_TOKEN || '';

// ITSM Routes
export const get_ticket = domain + 'api/tickets/';
export const post_ticket = domain + 'api/tickets/';
export const get_ticket_search = domain + 'api/tickets/search/';
export const post_login = domain + 'api/contacts/login/';

// Himoinsa Routes
export const post_auth = domain + 'api/v1/auth'
export const get_fleet_control = domain + 'api/v1/fleet-control'

// Helper to get the current user's API token
export async function getUserApiToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('api_token');
  } catch (error) {
    console.error('Error getting user API token:', error);
    return null;
  }
}