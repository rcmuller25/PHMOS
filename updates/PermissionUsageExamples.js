import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {usePatientPermissions, useCommunicationPermissions} from './usePermissions';
import PermissionsHandler from './PermissionsHandler';

// Example 1: App.js - Initialize essential permissions on app startup
const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Request essential permissions when app starts
        const results = await PermissionsHandler.requestEssentialPermissions();
        
        // Log results for debugging
        console.log('Essential permissions results:', results);
        
        // Handle any critical failures
        const hasStoragePermissions = results.STORAGE?.success;
        if (!hasStoragePermissions) {
          Alert.alert(
            'Warning',
            'Storage permissions are required for offline functionality. Some features may not work properly.'
          );
        }
      } catch (error) {
        console.error('Error initializing app permissions:', error);
      }
    };

    initializeApp();
  }, []);

  // Your existing app structure
  return (
    <YourMainNavigator />
  );
};

// Example 2: PatientFormScreen - Using hook for patient management
const PatientFormScreen = () => {
  const {
    hasAllPermissions,
    loading,
    requestAllPermissions,
    withPermissions,
  } = usePatientPermissions();

  const handleTakePhoto = async () => {
    await withPermissions('camera', async () => {
      // Your existing camera logic
      console.log('Opening camera for patient photo...');
      // launchCamera(options, callback);
    });
  };

  const handleAddToContacts = async () => {
    await withPermissions('contacts', async () => {
      // Your existing contacts logic
      console.log('Adding patient to contacts...');
      // ContactsContract.addContact(patientData);
    });
  };

  const handleSavePatientData = async () => {
    await withPermissions('storage', async () => {
      // Your existing save logic
      console.log('Saving patient data...');
      // savePatientToDatabase(patientData);
    });
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 20}}>Add New Patient</Text>
      
      {!hasAllPermissions && (
        <TouchableOpacity
          style={{
            backgroundColor: '#FF9800',
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
          }}
          onPress={requestAllPermissions}
          disabled={loading}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            {loading ? 'Requesting Permissions...' : 'Grant Required Permissions'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{backgroundColor: '#2196F3', padding: 15, borderRadius: 8, marginBottom: 10}}
        onPress={handleTakePhoto}>
        <Text style={{color: 'white', textAlign: 'center'}}>Take Patient Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, marginBottom: 10}}
        onPress={handleAddToContacts}>
        <Text style={{color: 'white', textAlign: 'center'}}>Add to Contacts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{backgroundColor: '#9C27B0', padding: 15, borderRadius: 8}}
        onPress={handleSavePatientData}>
        <Text style={{color: 'white', textAlign: 'center'}}>Save Patient Data</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 3: PatientListScreen - Communication permissions
const PatientListScreen = () => {
  const {withPermissions} = useCommunicationPermissions();

  const handleCallPatient = async (phoneNumber) => {
    await withPermissions('call', async () => {
      // Your existing call logic
      const {Linking} = require('react-native');
      const phoneUrl = `tel:${phoneNumber}`;
      
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Cannot make phone calls on this device');
      }
    });
  };

  const handleSendSMS = async (phoneNumber, message) => {
    await withPermissions('sms', async () => {
      // Your existing SMS logic
      console.log(`Sending SMS to ${phoneNumber}: ${message}`);
      // SendSMS.send(options, callback);
    });
  };

  return (
    <View style={{flex: 1}}>
      {/* Your patient list rendering */}
      <TouchableOpacity onPress={() => handleCallPatient('+27123456789')}>
        <Text>Call Patient</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handleSendSMS('+27123456789', 'Appointment reminder')}>
        <Text>Send SMS Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 4: AppointmentScreen - Calendar permissions
const AppointmentScreen = () => {
  const handleAddToCalendar = async (appointmentData) => {
    const hasCalendarPermission = await PermissionsHandler.hasFeaturePermissions('calendar');
    
    if (!hasCalendarPermission) {
      const result = await PermissionsHandler.requestFeaturePermissions('calendar');
      if (!result.success) {
        PermissionsHandler.handlePermissionResult(result, 'Calendar Access');
        return;
      }
    }

    // Your existing calendar logic
    console.log('Adding appointment to calendar:', appointmentData);
    // RNCalendarEvents.saveEvent(appointmentData);
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 20}}>Appointment Details</Text>
      
      <TouchableOpacity
        style={{backgroundColor: '#FF5722', padding: 15, borderRadius: 8}}
        onPress={() => handleAddToCalendar({
          title: 'Patient Consultation',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          location: 'Mobile Clinic Unit 1',
        })}>
        <Text style={{color: 'white', textAlign: 'center'}}>Add to Calendar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 5: LocationScreen - Mobile clinic with location permissions
const MobileClinicScreen = () => {
  const [location, setLocation] = React.useState(null);

  const getCurrentLocation = async () => {
    const hasLocationPermission = await PermissionsHandler.hasFeaturePermissions('location');
    
    if (!hasLocationPermission) {
      const result = await PermissionsHandler.requestFeaturePermissions('location');
      if (!result.success) {
        PermissionsHandler.handlePermissionResult(result, 'Location Access');
        return;
      }
    }

    // Your existing location logic
    console.log('Getting current location for mobile clinic...');
    /*
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        console.log('Current location:', position.coords);
      },
      (error) => console.error('Location error:', error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    */
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 20}}>Mobile Clinic Location</Text>
      
      <TouchableOpacity
        style={{backgroundColor: '#607D8B', padding: 15, borderRadius: 8, marginBottom: 20}}
        onPress={getCurrentLocation}>
        <Text style={{color: 'white', textAlign: 'center'}}>Get Current Location</Text>
      </TouchableOpacity>
      
      {location && (
        <View style={{backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8}}>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      )}
    </View>
  );
};

// Example 6: VoiceNoteScreen - Audio recording permissions
const VoiceNoteScreen = () => {
  const [recording, setRecording] = React.useState(false);

  const startRecording = async () => {
    const hasAudioPermission = await PermissionsHandler.hasFeaturePermissions('audio');
    
    if (!hasAudioPermission) {
      const result = await PermissionsHandler.requestFeaturePermissions('audio');
      if (!result.success) {
        PermissionsHandler.handlePermissionResult(result, 'Audio Recording');
        return;
      }
    }

    setRecording(true);
    console.log('Starting voice note recording...');
    // Your audio recording logic here
    // AudioRecorderPlayer.startRecorder();
  };

  const stopRecording = async () => {
    setRecording(false);
    console.log('Stopping voice note recording...');
    // AudioRecorderPlayer.stopRecorder();
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{fontSize: 18, marginBottom: 20}}>Patient Voice Notes</Text>
      
      <TouchableOpacity
        style={{
          backgroundColor: recording ? '#F44336' : '#4CAF50',
          padding: 15,
          borderRadius: 8,
        }}
        onPress={recording ? stopRecording : startRecording}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 7: Settings integration
const SettingsScreen = () => {
  return (
    <View style={{flex: 1}}>
      {/* Your existing settings content */}
      
      {/* Add the permissions screen as a section */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        }}
        onPress={() => {
          // Navigate to permissions screen
          // navigation.navigate('Permissions');
        }}>
        <Text style={{flex: 1, fontSize: 16}}>App Permissions</Text>
        <Text style={{color: '#666'}}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 8: Utility function for batch operations
const BatchOperationsExample = () => {
  const performBatchPatientUpdate = async (patients) => {
    // Check multiple permissions at once
    const permissionStatuses = await PermissionsHandler.checkAllPermissions();
    
    const requiredPermissions = [
      'android.permission.READ_CONTACTS',
      'android.permission.WRITE_CONTACTS',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ];
    
    const missingPermissions = requiredPermissions.filter(
      perm => permissionStatuses[perm] !== 'GRANTED'
    );
    
    if (missingPermissions.length > 0) {
      Alert.alert(
        'Permissions Required',
        'This operation requires additional permissions to complete successfully.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Grant Permissions',
            onPress: async () => {
              const result = await PermissionsHandler.requestPermissionGroup('PATIENT_MANAGEMENT');
              if (result.success) {
                // Retry the operation
                performBatchPatientUpdate(patients);
              }
            },
          },
        ]
      );
      return;
    }
    
    // Proceed with batch update
    console.log('Performing batch update for', patients.length, 'patients');
    // Your batch update logic here
  };

  return null; // This is just a utility example
};

export {
  PatientFormScreen,
  PatientListScreen,
  AppointmentScreen,
  MobileClinicScreen,
  VoiceNoteScreen,
  SettingsScreen,
  BatchOperationsExample,
};