import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Dynamic import for notifications to avoid warnings in Expo Go
let Notifications: any = null;

const getNotifications = async () => {
  if (isExpoGo) {
    return null;
  }

  if (!Notifications) {
    try {
      Notifications = await import('expo-notifications');
    } catch (error) {
      console.warn('expo-notifications not available:', error);
      return null;
    }
  }
  return Notifications;
};

// Initialize notifications if not in Expo Go
if (!isExpoGo) {
  getNotifications().then((notif) => {
    if (notif) {
      try {
        notif.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
      } catch (error) {
        console.log('Notification handler setup failed:', error);
      }
    }
  });
}

export interface PushNotificationToken {
  user_id: string;
  push_token: string;
  platform: string;
  created_at?: string;
}

/**
 * Register for push notifications and save token to database
 */
export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  let token: string | null = null;

  try {
    // Skip push notifications in Expo Go since they're not supported in SDK 53+
    if (isExpoGo) {
      console.log('ℹ️ Push notifications are not available in Expo Go. Use a development build for full functionality.');
      return null;
    }

    const Notifications = await getNotifications();
    if (!Notifications) {
      return null;
    }

    // Check permissions but don't request them here
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
      console.log('Push notification permission not granted. Skipping token registration.');
      return null;
    }

    // Get push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      throw new Error('Project ID not found in app.json');
    }

    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    token = pushToken.data;
    console.log('📱 Push token obtained:', token.substring(0, 20) + '...');

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFB347',
      });
    }

  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }

  return token;
}

/**
 * Send a local notification (appears immediately)
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: any
) {
  // Skip local notifications in Expo Go to avoid warnings
  if (isExpoGo) {
    console.log(`📱 Local notification (Expo Go): ${title} - ${body}`);
    return;
  }

  try {
    const Notifications = await getNotifications();
    if (!Notifications) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.log('Local notification failed:', error);
  }
}

/**
 * Send push notification to specific users
 * Note: Push tokens table removed - this function is disabled
 */
export async function sendPushNotificationToUsers(
  userIds: string[],
  title: string,
  body: string,
  data?: any
) {
  console.log('Push notifications disabled - push_tokens table removed');
  return;
}

/**
 * Send notification to all users of a specific type
 * Note: Push tokens table removed - this function is disabled
 */
export async function sendNotificationToUserType(
  userType: 'student' | 'expert' | 'admin' | 'all',
  title: string,
  body: string,
  data?: any
) {
  console.log('Push notifications disabled - push_tokens table removed');
  return;

}

/**
 * Setup notification listeners
 */
export async function setupNotificationListeners(
  onNotificationReceived?: (notification: any) => void,
  onNotificationResponse?: (response: any) => void
) {
  if (isExpoGo) {
    console.log('Notification listeners not available in Expo Go');
    return {
      receivedSubscription: { remove: () => {} },
      responseSubscription: { remove: () => {} },
    };
  }

  try {
    const Notifications = await getNotifications();
    if (!Notifications) {
      return {
        receivedSubscription: { remove: () => {} },
        responseSubscription: { remove: () => {} },
      };
    }

    // Notification received while app is foregrounded
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        console.log('📬 Notification received:', notification);
        onNotificationReceived?.(notification);
      }
    );

    // User tapped on notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response: any) => {
        console.log('👆 Notification tapped:', response);
        onNotificationResponse?.(response);
      }
    );

    return {
      receivedSubscription,
      responseSubscription,
    };
  } catch (error) {
    console.log('Failed to setup notification listeners:', error);
    return {
      receivedSubscription: { remove: () => {} },
      responseSubscription: { remove: () => {} },
    };
  }
}

/**
 * Remove notification listeners
 */
export function removeNotificationListeners(subscriptions: {
  receivedSubscription: { remove: () => void };
  responseSubscription: { remove: () => void };
}) {
  try {
    subscriptions.receivedSubscription?.remove?.();
    subscriptions.responseSubscription?.remove?.();
  } catch (error) {
    console.log('Error removing notification listeners:', error);
  }
}
