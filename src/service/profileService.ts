import { supabase } from '@/supabase_client';
import { CreateProfilePayload, Profile } from '../types/profile';

/** שליפת פרופיל לפי user_id */
export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as Profile | null;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

/** יצירה או עדכון פרופיל – upsert אחד במקום select + insert/update */
export const createOrUpdateProfile = async (
  userId: string,
  payload: CreateProfilePayload,
): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, ...payload }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error('Create/update profile error:', error);
    throw error;
  }
};
