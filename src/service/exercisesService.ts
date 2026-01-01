import { supabase } from '../../supabase_client';
import { Exercise } from '../types/exercise';
export const getExercisesByBodyParts = async (bodyPart: string[], page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
console.log("bodyparts2: ",bodyPart);
console.log("bodyparts1: ",bodyPart[0]);

  try {
    const { data, error, count } = await supabase
      .from('exercises')
      .select('*', { count: 'exact' })
      .overlaps('bodyParts', bodyPart)
      .order('sort_order', { ascending: true })
      // .in('bodyParts', bodyPart)
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
