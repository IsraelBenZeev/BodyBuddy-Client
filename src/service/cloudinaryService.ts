import { logError } from '@/src/lib/logger';
import { supabase } from '../../supabase_client';

const CUSTOM_EXERCISE_IMAGES_URL = process.env.EXPO_PUBLIC_CUSTOM_EXERCISE_IMAGES_URL ?? '';

// שולח את קבצי התמונות (uri מקומיים) לשרת כ-multipart/form-data; השרת מעלה אותן
// ל-Cloudinary (תיקיית custom-exercises) ומחזיר את ה-URLs המוכנים, לפי אותו סדר קלט.
export const uploadCustomExerciseImages = async (localUris: string[]): Promise<string[]> => {
  if (localUris.length === 0) return [];
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('נדרשת התחברות');
    if (!CUSTOM_EXERCISE_IMAGES_URL) throw new Error('חסרה כתובת שרת להעלאת תמונות');

    const formData = new FormData();
    localUris.forEach((uri, index) => {
      const fileName = uri.split('/').pop() ?? `exercise-${index}.jpg`;
      formData.append('images', {
        uri,
        name: fileName,
        type: 'image/jpeg',
      } as unknown as Blob);
    });

    const response = await fetch(CUSTOM_EXERCISE_IMAGES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '(no body)');
      throw new Error(`uploadCustomExerciseImages ${response.status}: ${body}`);
    }
    const result = (await response.json()) as { urls: string[] };
    return result.urls;
  } catch (error) {
    logError(error, 'uploadCustomExerciseImages');
    throw new Error('שגיאה בהעלאת התמונות');
  }
};
