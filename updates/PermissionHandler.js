import {Platform, Alert, Linking} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
  check,
  checkMultiple,
  openSettings,
} from 'react-native-permissions';

class PermissionsHandler {
  // Define permission groups based on app functionality
  static PERMISSION_GROUPS = {
    ESSENTIAL: {
      name: 'Essential App Functions',
      permissions: Platform.select({
        android: [
          PERMISSIONS.ANDROID.POST_NOTIFICATIONS, // Android 13+
        ],
        default: [],
      }),
      description: 'Required for basic app functionality and notifications',
    },
    
    STORAGE: {
      name: 'Storage Access',
      permissions: Platform.select({
        android: [
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
          PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        ],
        default: [],
      }),
      description: 'Required for saving patient data and documents offline',
    },

    PATIENT_MANAGEMENT: {
      name: 'Patient Management',
      permissions: Platform.select({
        android: [
          PERMISSIONS.ANDROID.READ_CONTACTS,
          PERMISSIONS.ANDROID.WRITE_CONTACTS,
          PERMISSIONS.ANDROID.CAMERA,
        ],
        default: [],
      }),
      description: 'Required for managing patient contacts and taking ID photos',
    },

    COMMUNICATION: {
      name: 'Patient Communication',
      permissions: Platform.select({
        android: [
          PERMISSIONS.ANDROID.CALL_PHONE,
          PERMISSIONS.ANDROID.SEND_SMS,
          PERMISSIONS.ANDROID.READ_SMS,
        ],
        default: [],
      }),
      description: 'Required for calling patients and sending appointment reminders',
    },

    APPOINTMENTS: {
      name: 'Appointment Management',
      permissions: Platform.select({
        android: [
          PERMISSIONS.ANDROID.READ_CALENDAR,
          PERMISSIONS.ANDROID.WRITE_CALENDAR,
        ],
        default: [],
      }),
      description: 'Required for managing appointment schedules',
    },

    LOCATION: {
      name: 'Mobile Clinic Services',
      permissions: Platform.select({
        android: [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ],
        default: [],
      }),
      description: 'Required for mobile and outreach clinic location tracking',
    },

    AUDIO: {
      name: 'Voice Notes',
      permissions: Platform.select({
        android: [
          PERMISSIONS.ANDROID.RECORD_AUDIO,
        ],
        default: [],
      }),
      description: 'Optional: For recording voice notes in patient records',
    },
  };

  /**
   * Check current status of all permissions
   */
  static async checkAllPermissions() {
    const allPermissions = Object.values(this.PERMISSION_GROUPS)
      .flatMap(group => group.permissions)
      .filter(permission => permission); // Remove undefined values

    if (allPermissions.length === 0) return {};

    try {
      const statuses = await checkMultiple(allPermissions);
      return statuses;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return {};
    }
  }

  /**
   * Request permissions for a specific group
   */
  static async requestPermissionGroup(groupKey, showRationale = true) {
    const group = this.PERMISSION_GROUPS[groupKey];
    if (!group || !group.permissions.length) {
      return {success: true, results: {}};
    }

    try {
      // Show rationale if requested
      if (showRationale) {
        const shouldContinue = await this.showPermissionRationale(
          group.name,
          group.description
        );
        if (!shouldContinue) {
          return {success: false, cancelled: true, results: {}};
        }
      }

      const results = await requestMultiple(group.permissions);
      const success = Object.values(results).every(
        result => result === RESULTS.GRANTED
      );

      return {success, results, group: group.name};
    } catch (error) {
      console.error(`Error requesting ${group.name} permissions:`, error);
      return {success: false, error, results: {}};
    }
  }

  /**
   * Request all essential permissions at app startup
   */
  static async requestEssentialPermissions() {
    const essentialGroups = ['ESSENTIAL', 'STORAGE', 'PATIENT_MANAGEMENT'];
    const results = {};
    
    for (const groupKey of essentialGroups) {
      const result = await this.requestPermissionGroup(groupKey, true);
      results[groupKey] = result;
      
      // If essential permissions are denied, show critical alert
      if (!result.success && groupKey === 'ESSENTIAL') {
        await this.showCriticalPermissionAlert();
      }
    }
    
    return results;
  }

  /**
   * Request permissions for specific feature usage
   */
  static async requestFeaturePermissions(feature) {
    const featurePermissionMap = {
      call: 'COMMUNICATION',
      sms: 'COMMUNICATION',
      calendar: 'APPOINTMENTS',
      location: 'LOCATION',
      camera: 'PATIENT_MANAGEMENT',
      audio: 'AUDIO',
      contacts: 'PATIENT_MANAGEMENT',
    };

    const groupKey = featurePermissionMap[feature];
    if (!groupKey) {
      console.warn(`Unknown feature permission requested: ${feature}`);
      return {success: false};
    }

    return await this.requestPermissionGroup(groupKey, true);
  }

  /**
   * Check if specific feature permissions are granted
   */
  static async hasFeaturePermissions(feature) {
    const featurePermissionMap = {
      call: [PERMISSIONS.ANDROID.CALL_PHONE],
      sms: [PERMISSIONS.ANDROID.SEND_SMS],
      calendar: [PERMISSIONS.ANDROID.READ_CALENDAR, PERMISSIONS.ANDROID.WRITE_CALENDAR],
      location: [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
      camera: [PERMISSIONS.ANDROID.CAMERA],
      audio: [PERMISSIONS.ANDROID.RECORD_AUDIO],
      contacts: [PERMISSIONS.ANDROID.READ_CONTACTS, PERMISSIONS.ANDROID.WRITE_CONTACTS],
      storage: [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE],
    };

    const permissions = featurePermissionMap[feature];
    if (!permissions) return false;

    try {
      const statuses = await checkMultiple(permissions);
      return Object.values(statuses).every(status => status === RESULTS.GRANTED);
    } catch (error) {
      console.error(`Error checking ${feature} permissions:`, error);
      return false;
    }
  }

  /**
   * Show permission rationale dialog
   */
  static showPermissionRationale(title, description) {
    return new Promise((resolve) => {
      Alert.alert(
        `${title} Permission`,
        `PHMOIS needs ${description.toLowerCase()} to provide the best healthcare service experience.`,
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Grant Permission',
            onPress: () => resolve(true),
          },
        ]
      );
    });
  }

  /**
   * Show critical permission alert
   */
  static showCriticalPermissionAlert() {
    return new Promise((resolve) => {
      Alert.alert(
        'Critical Permissions Required',
        'PHMOIS requires certain permissions to function properly in healthcare environments. Without these permissions, the app may not work as expected.',
        [
          {
            text: 'Exit App',
            style: 'destructive',
            onPress: () => {
              // You might want to close the app or navigate to a limited mode
              resolve(false);
            },
          },
          {
            text: 'Open Settings',
            onPress: () => {
              openSettings();
              resolve(true);
            },
          },
        ]
      );
    });
  }

  /**
   * Show permission denied alert with option to open settings
   */
  static showPermissionDeniedAlert(featureName) {
    return new Promise((resolve) => {
      Alert.alert(
        'Permission Required',
        `To use ${featureName}, please grant the required permissions in your device settings.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Open Settings',
            onPress: () => {
              openSettings();
              resolve(true);
            },
          },
        ]
      );
    });
  }

  /**
   * Handle permission result and show appropriate feedback
   */
  static handlePermissionResult(result, featureName) {
    const {success, results} = result;
    
    if (success) {
      return true;
    }

    // Check if any permissions were permanently denied
    const permanentlyDenied = Object.values(results).some(
      status => status === RESULTS.BLOCKED
    );

    if (permanentlyDenied) {
      this.showPermissionDeniedAlert(featureName);
    } else {
      Alert.alert(
        'Permission Denied',
        `${featureName} feature requires permission to function properly.`,
        [{text: 'OK'}]
      );
    }

    return false;
  }

  /**
   * Get user-friendly permission status
   */
  static getPermissionStatusText(status) {
    switch (status) {
      case RESULTS.GRANTED:
        return 'Granted';
      case RESULTS.DENIED:
        return 'Denied';
      case RESULTS.BLOCKED:
        return 'Blocked (Open Settings)';
      case RESULTS.UNAVAILABLE:
        return 'Not Available';
      default:
        return 'Unknown';
    }
  }

  /**
   * Generate permission status report for settings screen
   */
  static async getPermissionStatusReport() {
    const allStatuses = await this.checkAllPermissions();
    const report = {};

    Object.entries(this.PERMISSION_GROUPS).forEach(([key, group]) => {
      const groupStatuses = group.permissions.map(permission => ({
        permission,
        status: allStatuses[permission] || RESULTS.UNAVAILABLE,
        statusText: this.getPermissionStatusText(allStatuses[permission]),
      }));

      report[key] = {
        name: group.name,
        description: group.description,
        permissions: groupStatuses,
        allGranted: groupStatuses.every(p => p.status === RESULTS.GRANTED),
      };
    });

    return report;
  }
}

export default PermissionsHandler;