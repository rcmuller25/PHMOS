import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import PermissionsHandler from './PermissionsHandler';

const PermissionsScreen = () => {
  const [permissionReport, setPermissionReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPermissionStatus();
  }, []);

  const loadPermissionStatus = async () => {
    try {
      const report = await PermissionsHandler.getPermissionStatusReport();
      setPermissionReport(report);
    } catch (error) {
      console.error('Error loading permission status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPermissionStatus();
  };

  const requestGroupPermissions = async (groupKey) => {
    try {
      const result = await PermissionsHandler.requestPermissionGroup(groupKey);
      
      if (result.success) {
        Alert.alert('Success', `${result.group} permissions granted successfully!`);
      } else if (result.cancelled) {
        // User cancelled, no action needed
      } else {
        PermissionsHandler.handlePermissionResult(result, result.group);
      }
      
      // Refresh the status
      loadPermissionStatus();
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const requestAllEssential = async () => {
    try {
      setLoading(true);
      const results = await PermissionsHandler.requestEssentialPermissions();
      
      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.keys(results).length;
      
      Alert.alert(
        'Permission Request Complete',
        `${successCount} out of ${totalCount} essential permission groups granted.`
      );
      
      loadPermissionStatus();
    } catch (error) {
      console.error('Error requesting essential permissions:', error);
      Alert.alert('Error', 'Failed to request essential permissions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (allGranted) => {
    return allGranted ? '#4CAF50' : '#FF9800';
  };

  const getStatusText = (allGranted) => {
    return allGranted ? 'All Granted' : 'Action Required';
  };

  if (loading && Object.keys(permissionReport).length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        <View style={styles.header}>
          <Text style={styles.title}>App Permissions</Text>
          <Text style={styles.subtitle}>
            PHMOIS requires various permissions to provide healthcare services effectively.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.requestAllButton}
          onPress={requestAllEssential}
          disabled={loading}>
          <Text style={styles.requestAllButtonText}>
            {loading ? 'Requesting...' : 'Request Essential Permissions'}
          </Text>
        </TouchableOpacity>

        {Object.entries(permissionReport).map(([groupKey, group]) => (
          <View key={groupKey} style={styles.permissionGroup}>
            <View style={styles.groupHeader}>
              <View style={styles.groupTitleContainer}>
                <Text style={styles.groupTitle}>{group.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(group.allGranted)},
                  ]}>
                  <Text style={styles.statusBadgeText}>
                    {getStatusText(group.allGranted)}
                  </Text>
                </View>
              </View>
              <Text style={styles.groupDescription}>{group.description}</Text>
            </View>

            <View style={styles.permissionsList}>
              {group.permissions.map((perm, index) => (
                <View key={index} style={styles.permissionItem}>
                  <Text style={styles.permissionName}>
                    {perm.permission.split('.').pop()}
                  </Text>
                  <Text
                    style={[
                      styles.permissionStatus,
                      {
                        color:
                          perm.status === 'GRANTED' ? '#4CAF50' : '#FF5722',
                      },
                    ]}>
                    {perm.statusText}
                  </Text>
                </View>
              ))}
            </View>

            {!group.allGranted && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() => requestGroupPermissions(groupKey)}>
                <Text style={styles.requestButtonText}>
                  Request {group.name} Permissions
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Pull down to refresh permission status
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  requestAllButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionGroup: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  groupHeader: {
    marginBottom: 15,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  permissionsList: {
    marginBottom: 15,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  permissionName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  permissionStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  requestButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default PermissionsScreen;