import { supabase } from '@/supabase_client';
import { WorkoutPlan } from '../types/workout';

export const getWorkoutsByUserId = async (user_id: string) => {
  try {
    const { data, error } = await supabase
      .from('workouts_plans')
      .select('*')
      .order('created_at', { ascending: false })
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
    const { data, error } = await supabase.from('workouts_plans').upsert(newPlan).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getWorkoutPlanById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('workouts_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as WorkoutPlan;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteWorkoutPlan = async (id: string) => {
  console.log("id", id);
  
  try {
    const { error } = await supabase.from('workouts_plans').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
