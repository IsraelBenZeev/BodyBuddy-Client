import { supabase } from '../../supabase_client';
import { ExerciseLogDBType, SessionDBType } from '../types/session';

export const createSessionWorkout = async (session: SessionDBType) => {
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