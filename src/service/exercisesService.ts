import { supabase } from '../../supabase_client';
import { Exercise } from '../types';
export const getExercisesByBodyPart = async (bodyPart: string, page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const cleanedBodyPart = bodyPart.trim().toLowerCase();
  try {
    const { data, error, count } = await supabase
      .from('exercises')
      .select('*', { count: 'exact' })
      .contains('bodyParts', [cleanedBodyPart])
      .range(from, to);
    if (error) throw error;
    return { exercises: data as Exercise[], totalCount: count || 0 };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getExerciseById = async (exerciseId: string) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('exerciseId', exerciseId)
      .single();
    if (error) throw error;
    return data as Exercise;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getExerciseByIds = async (exerciseId: string[]) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .in('exerciseId', exerciseId);
    if (error) throw error;
    return data as Exercise[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
