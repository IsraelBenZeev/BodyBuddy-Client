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
        console.error("Error getting sessions:", error);
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
        console.error("Error getting session exercise logs:", error);
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
        console.error("Error creating workout log:", error);
        throw error;
    }
};
// שינוי ה-Type שיקבל מערך של אובייקטים
export const createSessionExerciseLogs = async (exerciseLogs: ExerciseLogDBType[]) => {
    try {
        const { data, error } = await supabase
            .from('exercise_logs')
            .insert(exerciseLogs)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error creating exercise logs:", error);
        throw error;
    }
};