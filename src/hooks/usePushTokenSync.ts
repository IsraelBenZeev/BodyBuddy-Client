import { useEffect } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { logError } from '../lib/logger';
import { upsertPushToken } from '../service/pushTokenService';
import { useAuthStore } from '../store/useAuthStore';
import { getDeviceId } from '../utils/deviceId';

// רץ בכל שינוי user (כולל טעינת session קיים באתחול) ומרשם/מרענן את טוקן הפוש
// של המכשיר הנוכחי. לא רץ כשאין user מחובר.
export const usePushTokenSync = (): void => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    let isCancelled = false;

    const syncPushToken = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') return;

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });
        const deviceId = await getDeviceId();
        const platform: 'ios' | 'android' = Platform.OS === 'ios' ? 'ios' : 'android';

        // בדיקה חוזרת: יתכן שהמשתמש התנתק בזמן שהמתנו להרשאות/לטוקן
        if (isCancelled || !useAuthStore.getState().user) return;

        await upsertPushToken(user.id, deviceId, expoPushToken, platform);
      } catch (error) {
        logError(error, 'usePushTokenSync');
      }
    };

    syncPushToken();

    return () => {
      isCancelled = true;
    };
  }, [user]);
};
