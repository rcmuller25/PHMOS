import { useEffect, useCallback } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useSyncStore } from '../stores/syncStore';
import { useNetInfo } from '@react-native-community/netinfo';

export function useSync() {
  const { syncFrequency, offlineMode } = useSettingsStore();
  const { syncData, isSyncing } = useSyncStore();
  const { isConnected } = useNetInfo();

  const getSyncInterval = useCallback(() => {
    switch (syncFrequency) {
      case '15min':
        return 15 * 60 * 1000;
      case '30min':
        return 30 * 60 * 1000;
      case '1hr':
        return 60 * 60 * 1000;
      default:
        return null;
    }
  }, [syncFrequency]);

  useEffect(() => {
    if (offlineMode || !isConnected || syncFrequency === 'manual') {
      return;
    }

    const interval = getSyncInterval();
    if (!interval) return;

    const syncInterval = setInterval(() => {
      if (!isSyncing) {
        syncData();
      }
    }, interval);

    return () => clearInterval(syncInterval);
  }, [syncFrequency, offlineMode, isConnected, isSyncing, syncData, getSyncInterval]);

  return {
    syncData,
    isSyncing,
  };
}