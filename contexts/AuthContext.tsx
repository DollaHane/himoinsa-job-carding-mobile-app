import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { router } from 'expo-router';

interface User {
  id: number;
  user_number: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  email: string;
  mobile_number: string | null;
  verification_token: string;
  email_verified_at: string | null;
  username: string;
  profile_image: string | null;
  monthly_quotations_value_target: number;
  monthly_contracts_value_target: number;
  password_reset_token: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  account_active: number;
  is_admin: number;
  receive_admin_emails: number;
  position: number;
  branch: string | null;
  is_sales_person: number;
  is_sales_manager: number;
  is_sales_dashboard: number;
  is_workshop: number;
  is_delivery_point: number;
  is_hiredesk_admin: number;
  is_accounts: number;
  country: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  handleTokenExpired: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth on mount
  useEffect(() => {
    loadSavedAuth();
  }, []);

  // Setup axios interceptor for handling 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && isAuthenticated) {
          console.log('Token expired - logging out');
          await handleTokenExpired();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [isAuthenticated]);

  const loadSavedAuth = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync('api_token');
      const savedUser = await SecureStore.getItemAsync('user_data');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading saved auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, user: User) => {
    try {
      // Store token securely
      await SecureStore.setItemAsync('api_token', token);

      // Store user data
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('api_token');
      await SecureStore.deleteItemAsync('user_data');

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const handleTokenExpired = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Error handling token expiration:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        isLoading,
        handleTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
