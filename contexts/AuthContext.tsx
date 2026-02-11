import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface Contact {
  active: string;
  email: string;
  firstname: string;
  lastname: string;
  id: string;
  userid: string;
  phonenumber: string;
  title: string;
  role: string;
  is_primary: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: Contact | null;
  apiToken: string | null;
  login: (token: string, contact: Contact) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Contact | null>(null);
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth on mount
  useEffect(() => {
    loadSavedAuth();
  }, []);

  const loadSavedAuth = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync('api_token');
      const savedUser = await SecureStore.getItemAsync('user_data');

      if (savedToken && savedUser) {
        setApiToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading saved auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, contact: Contact) => {
    try {
      // Store token securely
      await SecureStore.setItemAsync('api_token', token);

      // Store user data
      await SecureStore.setItemAsync('user_data', JSON.stringify(contact));

      setApiToken(token);
      setUser(contact);
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

      setApiToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        apiToken,
        login,
        logout,
        isLoading,
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
