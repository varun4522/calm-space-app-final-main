import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { Alert, Linking } from 'react-native';

// Conditionally import notifications only when not in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';
let Notifications: any = null;

if (!isExpoGo) {
  // Dynamic import to avoid loading in Expo Go
  import('expo-notifications').then(mod => {
    Notifications = mod;
  }).catch(err => {
    console.warn('Failed to load expo-notifications:', err);
  });
}

export type PermissionType = 'location' | 'notifications' | 'camera';

export const usePermissions = () => {
  const [isRationaleVisible, setIsRationaleVisible] = useState(false);

  const checkPermissionStatus = useCallback(async (type: PermissionType) => {
    let status = 'undetermined' as const;

    try {
      if (type === 'location') {
        const result = await Location.getForegroundPermissionsAsync();
        status = result.status;
      } else if (type === 'notifications') {
        if (isExpoGo || !Notifications) {
          // In Expo Go, always return undetermined
          status = 'undetermined';
        } else {
          const result = await Notifications.getPermissionsAsync();
          status = result.status;
        }
      } else if (type === 'camera') {
        status = 'undetermined';
      }
    } catch (error) {
      console.warn(`Error checking ${type} permission:`, error);
      status = 'undetermined';
    }

    return { status };
  }, []);

  const requestPermission = useCallback(async (type: PermissionType): Promise<boolean> => {
    try {
      let status = 'undetermined' as const;
      let canAskAgain = true;

      if (type === 'location') {
        const result = await Location.requestForegroundPermissionsAsync();
        status = result.status;
        canAskAgain = result.canAskAgain;
      } else if (type === 'notifications') {
        if (isExpoGo || !Notifications) {
          console.log('📱 Notifications not available in Expo Go');
          return false;
        }
        const result = await Notifications.requestPermissionsAsync();
        status = result.status;
        canAskAgain = result.canAskAgain;
      }

      if (status === 'granted') {
        return true;
      }

      if (!canAskAgain) {
        Alert.alert(
          'Permission Required',
          `You have permanently denied ${type} permissions. Please enable them in your device settings to use this feature.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }

      return false;
    } catch (error) {
      console.warn(`Error requesting ${type} permission:`, error);
      return false;
    }
  }, []);

  return {
    isRationaleVisible,
    setIsRationaleVisible,
    requestPermission,
    checkPermissionStatus,
  };
};
