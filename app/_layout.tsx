import { useEffect } from 'react';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '@/stores/authStore';

export default function RootLayout() {
  useFrameworkReady();
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="login" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

// Prevent access to protected routes if not authenticated
export function useProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }
  
  return null;
}
