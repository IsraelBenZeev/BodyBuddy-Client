import { logError } from '@/src/lib/logger';
import { PushPlatform } from '@/src/types/pushToken';
import { supabase } from '@/supabase_client';

// קורא ל-claim_push_device (RPC, SECURITY DEFINER) במקום upsert ישיר על הטבלה.
// מכשיר שייך למשתמש אחד בכל רגע נתון, כך שהתחברות של משתמש חדש על אותו מכשיר
// אמורה לדרוס אוטומטית את הבעלות הקודמת - אבל RLS רגיל לא יכול לאפשר ליוזר B
// למחוק/לעדכן שורה ששייכת ליוזר A (וזה גם לא רצוי, כדי שיוזר לא יוכל לגזול
// מכשיר של מישהו אחר). ה-RPC רץ בהרשאות מוגברות אבל מוגבל קשיח ל-auth.uid()
// של הקורא, כך שההשתלטות אפשרית רק על מכשיר שהקורא בעצמו מחובר ממנו עכשיו.
export const upsertPushToken = async (
  deviceId: string,
  expoPushToken: string,
  platform: PushPlatform
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('claim_push_device', {
      p_device_id: deviceId,
      p_expo_push_token: expoPushToken,
      p_platform: platform,
    });
    if (error) throw error;
  } catch (error) {
    logError(error, 'upsertPushToken');
  }
};

export const deletePushToken = async (deviceId: string): Promise<void> => {
  try {
    const { error } = await supabase.from('user_push_tokens').delete().eq('device_id', deviceId);
    if (error) throw error;
  } catch (error) {
    logError(error, 'deletePushToken');
  }
};
