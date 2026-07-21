import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router, Href } from 'expo-router';
import { logError } from '../lib/logger';

// allowlist בכוונה - לא סומכים על data חיצוני (payload של פוש) בתור נתיב ניווט חופשי
const SCREEN_ROUTES: Record<string, Href> = {
  workouts: '/workouts',
  nutrition: '/nutrition',
  profile: '/profile',
  home: '/',
};

const navigateFromNotificationData = (data: unknown): void => {
  if (!data || typeof data !== 'object' || !('screen' in data)) return;

  const { screen, id } = data as { screen?: unknown; id?: unknown };
  if (typeof screen !== 'string') return;

  if (screen === 'workout_plan' && typeof id === 'string') {
    router.push({ pathname: '/workout_plan/[paramse]', params: { paramse: id } });
    return;
  }

  const route = SCREEN_ROUTES[screen];
  if (route) router.push(route);
};

// מטפל בניווט בלחיצה על התראה - גם כשהאפליקציה נפתחת מחדש בעקבות הלחיצה (cold start)
// וגם כשהיא כבר פתוחה ברקע
export const useNotificationNavigation = (): void => {
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) navigateFromNotificationData(response.notification.request.content.data);
      })
      .catch((error) => logError(error, 'useNotificationNavigation'));

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      navigateFromNotificationData(response.notification.request.content.data);
    });

    return () => subscription.remove();
  }, []);
};
