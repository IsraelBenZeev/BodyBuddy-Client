import { logError } from '@/src/lib/logger';
import { supabase } from '../../supabase_client';
import { ExerciseSetDBType, SessionDBType } from '../types/session';

const WORKOUT_SESSION_URL = process.env.EXPO_PUBLIC_WORKOUT_SESSION_URL ?? '';

export const saveWorkoutSession = async (
  session: SessionDBType,
  exerciseSets: ExerciseSetDBType[]
) => {
  try {
    const {
      data: { session: authSession },
    } = await supabase.auth.getSession();
    const token = authSession?.access_token;

    if (!token) throw new Error('נדרשת התחברות');
    if (!WORKOUT_SESSION_URL) throw new Error('חסרה כתובת שרת לשמירת אימון');
    if (!session.id) throw new Error('חסר מזהה אימון');

    const response = await fetch(WORKOUT_SESSION_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: session.id,
        workout_plan_id: session.workout_plan_id,
        started_at: session.started_at,
        completed_at: session.completed_at,
        total_time: session.total_time,
        notes: session.notes,
        exercise_sets: exerciseSets.map((exerciseSet) => ({
          exercise_id: exerciseSet.exercise_id,
          set_number: exerciseSet.set_number,
          values: exerciseSet.values,
          rest_seconds: exerciseSet.rest_seconds ?? null,
        })),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '(no body)');
      throw new Error(`saveWorkoutSession ${response.status}: ${body}`);
    }

    return await response.json();
  } catch (error) {
    logError(error, 'saveWorkoutSession');
    throw error;
  }
};

export const getSessionsPage = async (
  userId: string,
  workoutPlanId: string,
  page: number,
  pageSize: number
): Promise<SessionDBType[]> => {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('sessions')
      .select('id, user_id, workout_plan_id, started_at, completed_at, total_time, notes')
      .eq('user_id', userId)
      .eq('workout_plan_id', workoutPlanId)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw error;
    return (data ?? []) as SessionDBType[];
  } catch (error) {
    logError(error, 'getSessionsPage');
    throw error;
  }
};

export const getSessionExerciseLogs = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('exercise_sets')
      .select()
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as ExerciseSetDBType[];
  } catch (error) {
    logError(error, 'getSessionExerciseLogs');
    throw error;
  }
};

export const createSession = async (session: SessionDBType) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          ...session,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logError(error, 'createSession');
    throw error;
  }
};
// שינוי ה-Type שיקבל מערך של אובייקטים
export const getExerciseLogsByExerciseId = async (userId: string, exerciseId: string) => {
  try {
    const { data, error } = await supabase
      .from('exercise_sets')
      .select()
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data as ExerciseSetDBType[];
  } catch (error) {
    logError(error, 'getExerciseLogsByExerciseId');
    throw error;
  }
};

export const getAllUserSessions = async (userId: string): Promise<SessionDBType[]> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('id, user_id, started_at, completed_at, total_time')
      .eq('user_id', userId)
      .order('started_at', { ascending: true });
    if (error) throw error;
    return data as SessionDBType[];
  } catch (error) {
    logError(error, 'getAllUserSessions');
    throw error;
  }
};

export const createSessionExerciseLogs = async (exerciseLogs: ExerciseSetDBType[]) => {
  try {
    const { data, error } = await supabase.from('exercise_sets').insert(exerciseLogs).select();

    if (error) throw error;
    return data;
  } catch (error) {
    logError(error, 'createSessionExerciseLogs');
    throw error;
  }
};

type LatestSessionWithExerciseSets = {
  exercise_sets: ExerciseSetDBType[] | null;
};

export const getLatestWorkoutPlanExerciseSets = async (
  userId: string,
  workoutPlanId: string
): Promise<ExerciseSetDBType[]> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('exercise_sets(*)')
      .eq('user_id', userId)
      .eq('workout_plan_id', workoutPlanId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as LatestSessionWithExerciseSets | null)?.exercise_sets ?? [];
  } catch (error) {
    logError(error, 'getLatestWorkoutPlanExerciseSets');
    throw error;
  }
};
