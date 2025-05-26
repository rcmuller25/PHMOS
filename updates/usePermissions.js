import {useState, useEffect, useCallback} from 'react';
import PermissionsHandler from './PermissionsHandler';

/**
 * Custom hook for managing permissions in PHMOIS app
 * @param {string|string[]} requiredFeatures - Features that require permissions
 * @param {boolean} checkOnMount - Whether to check permissions when component mounts
 */
const usePermissions = (requiredFeatures = [], checkOnMount = true) => {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasAllPermissions, setHasAllPermissions] = useState(false);

  const features = Array.isArray(requiredFeatures) ? requiredFeatures : [requiredFeatures];

  /**
   * Check permissions for all required features
   */
  const checkPermissions = useCallback(async () => {
    if (features.length === 0) {
      setHasAllPermissions(true);
      return {};
    }

    setLoading(true);
    try {
      const permissionStatuses = {};
      
      for (const feature of features) {
        const hasPermission = await PermissionsHandler.hasFeaturePermissions(feature);
        permissionStatuses[feature] = hasPermission;
      }
      
      setPermissions(permissionStatuses);
      
      const allGranted = Object.values(permissionStatuses).every(Boolean);
      setHasAllPermissions(allGranted);
      
      return permissionStatuses;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return {};
    } finally {
      setLoading(false);
    }
  }, [features]);

  /**
   * Request permissions for a specific feature
   */
  const requestPermission = useCallback(async (feature) => {
    setLoading(true);
    try {
      const result = await PermissionsHandler.requestFeaturePermissions(feature);
      
      if (result.success) {
        setPermissions(prev => ({
          ...prev,
          [feature]: true,
        }));
        
        // Recheck all permissions to update hasAllPermissions
        await checkPermissions();
        
        return true;
      } else {
        PermissionsHandler.handlePermissionResult(result, feature);
        return false;
      }
    } catch (error) {
      console.error(`Error requesting ${feature} permission:`, error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [checkPermissions]);

  /**
   * Request all required permissions
   */
  const requestAllPermissions = useCallback(async () => {
    if (features.length === 0) return true;

    setLoading(true);
    try {
      const results = {};
      
      for (const feature of features) {
        const success = await requestPermission(feature);
        results[feature] = success;
      }
      
      const allGranted = Object.values(results).every(Boolean);
      setHasAllPermissions(allGranted);
      
      return allGranted;
    } catch (error) {
      console.error('Error requesting all permissions:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [features, requestPermission]);

  /**
   * Execute a function only if permissions are granted
   */
  const withPermissions = useCallback(async (feature, callback, options = {}) => {
    const {
      requestIfMissing = true,
      showDeniedAlert = true,
    } = options;

    // Check if we already know the permission status
    let hasPermission = permissions[feature];
    
    // If unknown, check the permission
    if (hasPermission === undefined) {
      hasPermission = await PermissionsHandler.hasFeaturePermissions(feature);
      setPermissions(prev => ({
        ...prev,
        [feature]: hasPermission,
      }));
    }

    if (hasPermission) {
      return await callback();
    }

    // Permission not granted
    if (requestIfMissing) {
      const granted = await requestPermission(feature);
      if (granted) {
        return await callback();
      }
    }

    if (showDeniedAlert) {
      PermissionsHandler.showPermissionDeniedAlert(feature);
    }

    return null;
  }, [permissions, requestPermission]);

  // Check permissions on mount if requested
  useEffect(() => {
    if (checkOnMount) {
      checkPermissions();
    }
  }, [checkOnMount, checkPermissions]);

  return {
    permissions,
    hasAllPermissions,
    loading,
    checkPermissions,
    requestPermission,
    requestAllPermissions,
    withPermissions,
  };
};

/**
 * Specific hooks for common permission scenarios in PHMOIS
 */

// Hook for patient management features
export const usePatientPermissions = () => {
  return usePermissions(['contacts', 'camera', 'storage']);
};

// Hook for communication features
export const useCommunicationPermissions = () => {
  return usePermissions(['call', 'sms']);
};

// Hook for appointment management
export const useAppointmentPermissions = () => {
  return usePermissions(['calendar']);
};

// Hook for mobile clinic features
export const useMobileClinicPermissions = () => {
  return usePermissions(['location']);
};

// Hook for media features
export const useMediaPermissions = () => {
  return usePermissions(['camera', 'audio', 'storage']);
};

export default usePermissions;