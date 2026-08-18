import { logError } from '@/src/lib/logger';
import { supabase } from '@/supabase_client';

const DELETE_ACCOUNT_URL = process.env.EXPO_PUBLIC_DELETE_ACCOUNT_URL ?? '';

interface ErrorResponse {
  error: Error | null;
}

export const deleteAccount = async (): Promise<ErrorResponse> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error('נדרשת התחברות');
    if (!DELETE_ACCOUNT_URL) throw new Error('חסרה כתובת שרת למחיקת חשבון');

    const response = await fetch(DELETE_ACCOUNT_URL, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '(no body)');
      throw new Error(`deleteAccount ${response.status}: ${body}`);
    }
    return { error: null };
  } catch (error) {
    logError(error, 'deleteAccount');
    return { error: error as Error };
  }
};
