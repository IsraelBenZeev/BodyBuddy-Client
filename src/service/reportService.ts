import { supabase } from '../../supabase_client';
import { CreateExerciseReportPayload } from '../types/exerciseReport';

// No .select() after insert: exercise_reports intentionally has no SELECT RLS policy
// (the developer reviews reports via the Supabase dashboard, not the client) — asking
// PostgREST to return the inserted row would be blocked by RLS and fail the whole insert.
// The server listens for new rows in this table directly (DB-side), so no separate
// notify call is needed here.
export const createExerciseReport = async (
  userId: string,
  payload: CreateExerciseReportPayload
): Promise<void> => {
  const { error } = await supabase.from('exercise_reports').insert({ ...payload, user_id: userId });
  if (error) throw error;
};
