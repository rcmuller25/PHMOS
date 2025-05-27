import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

// Define user interface
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
}

// Define authentication state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Secure storage helper functions
const secureStore = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
};

// Create the auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password, rememberMe) => {
        set({ isLoading: true, error: null });
        
        try {
          // For demo purposes, we're using hardcoded credentials
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
          
          if (email === 'admin@phmos.com' && password === 'Admin@123') {
            const user = {
              id: '1',
              username: 'admin',
              email: 'admin@phmos.com',
              role: 'admin' as const,
            };
            
            const token = 'demo-jwt-token-' + Math.random().toString(36).substring(2);
            
            // Store authentication data
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            });
            
            // If using rememberMe, store token in SecureStore for persistence
            if (rememberMe) {
              await secureStore.setItem('authToken', token);
            }
          } else {
            set({ 
              isLoading: false, 
              error: 'Invalid email or password. Please try again.' 
            });
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: 'An error occurred during login. Please try again.' 
          });
          console.error('Login error:', error);
        }
      },
      
      logout: async () => {
        // Clear secure storage
        await secureStore.removeItem('authToken');
        
        // Reset auth state
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null
        });
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        // Only persist these fields, exclude sensitive data and functions
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);