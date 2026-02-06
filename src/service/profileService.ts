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

/** יצירה או עדכון פרופיל – בודק אם קיים ואז insert/update בהתאם */
export const createOrUpdateProfile = async (
  userId: string,
  payload: CreateProfilePayload,
): Promise<Profile> => {
  try {
    // בדיקה האם כבר קיים פרופיל למשתמש
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    let result;

    if (existing) {
      // עדכון פרופיל קיים
      result = await supabase
        .from('profiles')
        .update(payload)
        .eq('user_id', userId)
        .select()
        .single();
    } else {
      // יצירת פרופיל חדש
      result = await supabase
        .from('profiles')
        .insert({ user_id: userId, ...payload })
        .select()
        .single();
    }

    if (result.error) throw result.error;
    return result.data as Profile;
  } catch (error) {
    console.error('Create/update profile error:', error);
    throw error;
  }
};
