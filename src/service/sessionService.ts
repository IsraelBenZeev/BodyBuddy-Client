import { logError } from '@/src/lib/logger';
import { supabase } from '../../supabase_client';
import { ExerciseLogDBType, SessionDBType } from '../types/session';
export const getSessions = async (userId: string, workoutPlanId: string) => {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .select()
            .eq('user_id', userId)
            .eq('workout_plan_id', workoutPlanId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    } catch (error) {
        logError(error, 'getSessions');
        throw error;
    }
}

export const getSessionExerciseLogs = async (sessionId: string) => {
    try {
        const { data, error } = await supabase
            .from('exercise_logs')
            .select()
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as ExerciseLogDBType[];
    } catch (error) {
        logError(error, 'getSessionExerciseLogs');
        throw error;
    }
}

export const createSession = async (session: SessionDBType) => {
    try {
        const { data, error } = await supabase
            .from('sessions')
            .insert([{
                ...session,
            }])
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
            .from('exercise_logs')
            .select()
            .eq('user_id', userId)
            .eq('exercise_id', exerciseId)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data as ExerciseLogDBType[];
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

export const createSessionExerciseLogs = async (exerciseLogs: ExerciseLogDBType[]) => {
    try {
        const { data, error } = await supabase
            .from('exercise_logs')
            .insert(exerciseLogs)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        logError(error, 'createSessionExerciseLogs');
        throw error;
    }
};