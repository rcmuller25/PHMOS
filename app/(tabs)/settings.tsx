import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'expo-router';
import { SettingsSection } from '../../components/SettingsSection';
import { SettingsItem } from '../../components/SettingsItem';
import { Button } from '../../components/Button';

export default function Settings() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const {
    offlineMode,
    toggleOfflineMode,
    syncFrequency,
    setSyncFrequency,
    showNotifications,
    toggleNotifications,
    theme,
    setTheme,
  } = useSettingsStore();

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleSyncNow = () => {
    // Implement sync logic here
    Alert.alert('Sync', 'Syncing data with server...');
  };

  return (
    <ScrollView style={styles.container}>
      <SettingsSection title="Account">
        <SettingsItem title="Logout">
          <Button 
            title="Logout" 
            onPress={handleLogout}
            backgroundColor="#EF4444"
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Data Synchronization">
        <SettingsItem 
          title="Offline Mode" 
          description="Work without internet connection"
        >
          <Switch
            value={offlineMode}
            onValueChange={toggleOfflineMode}
            trackColor={{ false: '#CBD5E0', true: '#0077B6' }}
          />
        </SettingsItem>
        
        <SettingsItem 
          title="Sync Frequency" 
          description="How often to sync with server"
        >
          <View style={styles.syncOptions}>
            {['15min', '30min', '1hr', 'Manual'].map((option) => (
              <Button
                key={option}
                title={option}
                onPress={() => setSyncFrequency(option)}
                backgroundColor={syncFrequency === option ? '#0077B6' : '#E2E8F0'}
                style={styles.syncOption}
              />
            ))}
          </View>
        </SettingsItem>

        <Button 
          title="Sync Now" 
          onPress={handleSyncNow}
          backgroundColor="#0077B6"
          style={styles.syncButton}
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsItem 
          title="Notifications" 
          description="Enable appointment reminders"
        >
          <Switch
            value={showNotifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#CBD5E0', true: '#0077B6' }}
          />
        </SettingsItem>

        <SettingsItem 
          title="Theme" 
          description="Choose app appearance"
        >
          <View style={styles.themeOptions}>
            {['light', 'dark', 'system'].map((option) => (
              <Button
                key={option}
                title={option}
                onPress={() => setTheme(option)}
                backgroundColor={theme === option ? '#0077B6' : '#E2E8F0'}
                style={styles.themeOption}
              />
            ))}
          </View>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsItem title="Version">
          <Text style={styles.version}>1.0.0</Text>
        </SettingsItem>
      </SettingsSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  syncOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  syncOption: {
    flex: 1,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flex: 1,
  },
  syncButton: {
    marginTop: 16,
  },
  version: {
    fontSize: 14,
    color: '#718096',
  },
});