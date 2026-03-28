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

/** יצירה או עדכון פרופיל */
export const createOrUpdateProfile = async (
  userId: string,
  payload: CreateProfilePayload,
): Promise<Profile> => {
  try {
    // נסה לעדכון קיים
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update(payload)
      .eq('user_id', userId)
      .select()
      .single();

    if (!updateError) return updated as Profile;

    // אם לא קיים – הכנס חדש
    if (updateError.code === 'PGRST116') {
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({ user_id: userId, ...payload })
        .select()
        .single();

      if (insertError) throw insertError;
      return inserted as Profile;
    }

    throw updateError;
  } catch (error) {
    console.error('Create/update profile error:', error);
    throw error;
  }
};
