import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSettingsStore } from '../../stores/settingsStore';
import { usePatientsStore } from '../../stores/patientsStore';
import { useAppointmentsStore } from '../../stores/appointmentsStore';
import { useNavigation } from '@react-navigation/native';
import { SettingsSection } from '../../components/SettingsSection';
import { SettingsItem } from '../../components/SettingsItem';
import { Button } from '../../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';

type SettingsStackParamList = {
  About: undefined;
};

interface SettingsScreenProps {
  navigation: StackNavigationProp<SettingsStackParamList>;
}

export default function Settings({ navigation }: SettingsScreenProps) {
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
  
  const { resetPatients } = usePatientsStore();
  const { resetAppointments } = useAppointmentsStore();
  
  // Handle data reset
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all patients and appointments. This action cannot be undone. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetPatients();
            resetAppointments();
            Alert.alert('Data Reset', 'All patient and appointment data has been cleared.');
          },
        },
      ]
    );
  };
  
  // Handle sync frequency change
  const handleSyncFrequencyChange = (value: string) => {
    setSyncFrequency(value);
    // In a real app, this would trigger a sync schedule update
  };
  
  // Handle theme change
  const handleThemeChange = (value: string) => {
    setTheme(value);
    // In a real app, this would apply the theme immediately
  };
  
  // Simulate sync
  const handleSyncNow = () => {
    Alert.alert(
      'Sync Data',
      'Synchronizing data with the server...',
      [
        {
          text: 'OK',
          onPress: () => {
            // Simulate sync delay
            setTimeout(() => {
              Alert.alert('Sync Complete', 'Your data has been successfully synchronized with the server.');
            }, 1500);
          },
        },
      ]
    );
  };

  // Remove this duplicate line:
  // const navigation = useNavigation();
  
  // Add this new handler
  const handleAboutPress = () => {
    navigation.navigate('settings/about'); // Updated route name
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsSection title="Data Synchronization">
        <SettingsItem 
          title="Offline Mode" 
          description="Work without internet connection"
        >
          <Switch
            trackColor={{ false: '#CBD5E0', true: '#0077B6' }}
            thumbColor={offlineMode ? '#FFFFFF' : '#FFFFFF'}
            onValueChange={toggleOfflineMode}
            value={offlineMode}
          />
        </SettingsItem>
        
        <SettingsItem 
          title="Sync Frequency" 
          description="How often to sync with the server"
        >
          <View style={styles.syncFrequencyContainer}>
            <TouchableOpacity
              style={[
                styles.syncFrequencyButton,
                syncFrequency === '15min' && styles.syncFrequencyButtonActive,
              ]}
              onPress={() => handleSyncFrequencyChange('15min')}
            >
              <Text
                style={[
                  styles.syncFrequencyText,
                  syncFrequency === '15min' && styles.syncFrequencyTextActive,
                ]}
              >
                15min
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.syncFrequencyButton,
                syncFrequency === '30min' && styles.syncFrequencyButtonActive,
              ]}
              onPress={() => handleSyncFrequencyChange('30min')}
            >
              <Text
                style={[
                  styles.syncFrequencyText,
                  syncFrequency === '30min' && styles.syncFrequencyTextActive,
                ]}
              >
                30min
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.syncFrequencyButton,
                syncFrequency === '1hr' && styles.syncFrequencyButtonActive,
              ]}
              onPress={() => handleSyncFrequencyChange('1hr')}
            >
              <Text
                style={[
                  styles.syncFrequencyText,
                  syncFrequency === '1hr' && styles.syncFrequencyTextActive,
                ]}
              >
                1hr
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.syncFrequencyButton,
                syncFrequency === 'manual' && styles.syncFrequencyButtonActive,
              ]}
              onPress={() => handleSyncFrequencyChange('manual')}
            >
              <Text
                style={[
                  styles.syncFrequencyText,
                  syncFrequency === 'manual' && styles.syncFrequencyTextActive,
                ]}
              >
                Manual
              </Text>
            </TouchableOpacity>
          </View>
        </SettingsItem>
        
        <Button 
          title="Sync Now" 
          onPress={handleSyncNow}
          backgroundColor="#0077B6"
          style={styles.syncButton}
        />
      </SettingsSection>
      
      <SettingsSection title="App Preferences">
        <SettingsItem 
          title="Notifications" 
          description="Appointment reminders and alerts"
        >
          <Switch
            trackColor={{ false: '#CBD5E0', true: '#0077B6' }}
            thumbColor={showNotifications ? '#FFFFFF' : '#FFFFFF'}
            onValueChange={toggleNotifications}
            value={showNotifications}
          />
        </SettingsItem>
        
        <SettingsItem 
          title="Theme" 
          description="Choose app appearance"
        >
          <View style={styles.themeContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === 'light' && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text
                style={[
                  styles.themeText,
                  theme === 'light' && styles.themeTextActive,
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === 'dark' && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text
                style={[
                  styles.themeText,
                  theme === 'dark' && styles.themeTextActive,
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === 'system' && styles.themeButtonActive,
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <Text
                style={[
                  styles.themeText,
                  theme === 'system' && styles.themeTextActive,
                ]}
              >
                System
              </Text>
            </TouchableOpacity>
          </View>
        </SettingsItem>
      </SettingsSection>
      
      <SettingsSection title="Data Management">
        <Button 
          title="Reset All Data" 
          onPress={handleResetData}
          backgroundColor="#EF476F"
          style={styles.resetButton}
        />
        <Text style={styles.resetWarning}>
          This will permanently delete all patients and appointments. This action cannot be undone.
        </Text>
      </SettingsSection>
      
      <SettingsSection title="About">
        <SettingsItem title="About Us" onPress={handleAboutPress}>
          <Text style={styles.aboutLink}>Learn more about PHMOS</Text>
        </SettingsItem>
      </SettingsSection>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Primary Healthcare Mobile Outreach System</Text>
        <Text style={styles.versionNumber}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

// Add this to your StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  content: {
    padding: 16,
  },
  syncFrequencyContainer: {
    flexDirection: 'row',
  },
  syncFrequencyButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#F1F5F9',
  },
  syncFrequencyButtonActive: {
    backgroundColor: '#0077B6',
  },
  syncFrequencyText: {
    fontSize: 14,
    color: '#718096',
  },
  syncFrequencyTextActive: {
    color: '#FFFFFF',
  },
  syncButton: {
    marginTop: 16,
  },
  themeContainer: {
    flexDirection: 'row',
  },
  themeButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#F1F5F9',
  },
  themeButtonActive: {
    backgroundColor: '#0077B6',
  },
  themeText: {
    fontSize: 14,
    color: '#718096',
  },
  themeTextActive: {
    color: '#FFFFFF',
  },
  resetButton: {
    marginTop: 8,
  },
  resetWarning: {
    fontSize: 12,
    color: '#718096',
    marginTop: 8,
    fontStyle: 'italic',
  },
  versionContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#718096',
  },
  versionNumber: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  aboutLink: {
    color: '#0077B6',
    fontWeight: '500',
  },
});