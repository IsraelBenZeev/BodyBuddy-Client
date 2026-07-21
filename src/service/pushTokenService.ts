import { logError } from '@/src/lib/logger';
import { PushPlatform } from '@/src/types/pushToken';
import { supabase } from '@/supabase_client';

// onConflict: device_id (לא user_id+device_id) — מכשיר שייך למשתמש אחד בכל רגע נתון,
// כך שהתחברות של משתמש חדש על אותו מכשיר דורסת אוטומטית את הבעלות הקודמת.
export const upsertPushToken = async (
  userId: string,
  deviceId: string,
  expoPushToken: string,
  platform: PushPlatform
): Promise<void> => {
  try {
    const { error } = await supabase.from('user_push_tokens').upsert(
      {
        user_id: userId,
        device_id: deviceId,
        expo_push_token: expoPushToken,
        platform,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'device_id' }
    );
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
