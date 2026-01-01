import { supabase } from '@/supabase_client';
import { WorkoutPlan } from '../types/workout';

export const getWorkoutsByUserId = async (user_id: string) => {
  try {
    const { data, error } = await supabase
      .from('workouts_plans')
      .select('*')
      .eq('user_id', user_id);
    if (error) throw error;
    return data as WorkoutPlan[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createNewWorkoutPlan = async (newPlan: WorkoutPlan) => {
  try {
    const { data, error } = await supabase.from('workouts_plans').insert(newPlan).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
