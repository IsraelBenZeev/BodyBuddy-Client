export type PushPlatform = 'ios' | 'android';

export interface UserPushToken {
  id: string;
  user_id: string;
  expo_push_token: string;
  device_id: string;
  platform: PushPlatform;
  created_at: string;
  updated_at: string;
}
