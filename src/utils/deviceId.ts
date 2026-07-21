import * as SecureStore from 'expo-secure-store';
import { randomUUID } from 'expo-crypto';

const DEVICE_ID_KEY = 'device_id';

// UUID שנוצר פעם אחת ונשמר על ההתקנה עצמה — לא מזהה חומרה (אסור לפי מדיניות גוגל).
// זה מה שמאפשר להחליף בעלות על שורת הפוש בטבלה כשמשתמש אחר מתחבר מאותו מכשיר.
export const getDeviceId = async (): Promise<string> => {
  const existing = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (existing) return existing;

  const deviceId = randomUUID();
  await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  return deviceId;
};
