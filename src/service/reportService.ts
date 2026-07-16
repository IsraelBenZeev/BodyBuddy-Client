import { logError } from '@/src/lib/logger';
import { supabase } from '../../supabase_client';
import { CreateExerciseReportPayload } from '../types/exerciseReport';

// No .select() after insert: exercise_reports intentionally has no SELECT RLS policy
// (the developer reviews reports via the Supabase dashboard, not the client) — asking
// PostgREST to return the inserted row would be blocked by RLS and fail the whole insert.
export const createExerciseReport = async (
  userId: string,
  payload: CreateExerciseReportPayload
): Promise<void> => {
  const { error } = await supabase.from('exercise_reports').insert({ ...payload, user_id: userId });
  if (error) throw error;
};

const REPORT_EXERCISE_URL = process.env.EXPO_PUBLIC_REPORT_EXERCISE_URL ?? '';

// Best-effort: the DB insert above is the source of truth for the report,
// this is just a notification nicety — errors are logged, never thrown.
export const notifyExerciseReportServer = async (payload: CreateExerciseReportPayload): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token || !REPORT_EXERCISE_URL) return;

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
      logError(new Error(`notifyExerciseReportServer ${response.status}: ${body}`), 'notifyExerciseReportServer');
    }
  } catch (error) {
    logError(error, 'notifyExerciseReportServer');
  }
};
