import { logError } from '../lib/logger';
import { supabase } from '../../supabase_client';
import { CreateExerciseReportPayload } from '../types/exerciseReport';

const REPORT_EXERCISE_URL = process.env.EXPO_PUBLIC_REPORT_EXERCISE_URL ?? '';

// Goes through the server (not a direct Supabase insert): the server inserts the row with the
// service_role key and sends the internal notification email itself, so the client never needs
// insert access to exercise_reports.
export const createExerciseReport = async (payload: CreateExerciseReportPayload): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('נדרשת התחברות');

  const response = await fetch(REPORT_EXERCISE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '(no body)');
    logError(new Error(`createExerciseReport ${response.status}: ${body}`), 'createExerciseReport');
    throw new Error('שגיאה בשליחת הדיווח');
  }
};
