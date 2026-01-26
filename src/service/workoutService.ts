import { supabase } from '@/supabase_client';
import { WorkoutPlan } from '../types/workout';

export const getWorkoutsByUserUserId = async (user_id: string) => {
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
export const getWorkoutPlanById = async (id: string) => {

  try {
    const { data, error } = await supabase.from('workouts_plans').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data as WorkoutPlan;
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
export const addExerciseToPlan = async (idExercise: string, planIds: string[]) => {
  try {
    const { error, data } = await supabase.rpc('add_exercise_to_plans', {
      plan_ids: planIds,
      new_exercise_id: idExercise
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// export const getWorkoutPlanById = async (id: string) => {
//   try {
//     const { data, error } = await supabase
//       .from('workouts_plans')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) throw error;
//     return data as WorkoutPlan;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
export const deleteWorkoutPlan = async (id: string) => {
  try {
    const { error } = await supabase.from('workouts_plans').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getExerciseByWorkoutPlanId = async (workoutPlanId: string) => {
  try {
    const { data, error } = await supabase
      .from('exercise_logs')
      .select('*')
      .eq('exercise_logs', workoutPlanId);
    if (error) throw error;
    return data as string[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
