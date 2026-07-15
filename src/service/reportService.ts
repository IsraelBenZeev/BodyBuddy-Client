import { logError } from '@/src/lib/logger';
import { supabase } from '../../supabase_client';
import { CreateExerciseReportPayload, ExerciseReport } from '../types/exerciseReport';

export const createExerciseReport = async (
  userId: string,
  payload: CreateExerciseReportPayload
): Promise<ExerciseReport> => {
  const { data, error } = await supabase
    .from('exercise_reports')
    .insert({ ...payload, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as ExerciseReport;
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
