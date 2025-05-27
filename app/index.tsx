import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect to login if not authenticated, otherwise to home
  return isAuthenticated ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />;
}