import { logError } from '@/src/lib/logger';
import { supabase } from '../../supabase_client';
import { getCustomExercisesByIds } from './customExercisesService';
import { isCustomExerciseId, toRawCustomExerciseId } from '../types/customExercise';
import { Exercise } from '../types/exercise';

export const getFavoriteIds = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('favorite_exercises')
    .select('exercise_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((r) => r.exercise_id);
};

export const addFavorite = async (userId: string, exerciseId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorite_exercises')
    .insert({ user_id: userId, exercise_id: exerciseId });
  if (error) throw error;
};

export const removeFavorite = async (userId: string, exerciseId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorite_exercises')
    .delete()
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId);
  if (error) throw error;
};
export const getExercisesByBodyParts = async (bodyPart: string[], page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  try {
    const { data, error, count } = await supabase
      .from('exercises_v2')
      .select('*', { count: 'exact' })
      .overlaps('bodyParts', bodyPart)
      .order('sort_order', { ascending: true })
      .range(from, to);
    if (error) throw error;
    return { exercises: data as Exercise[], totalCount: count || 0 };
  } catch (error) {
    logError(error, 'exercisesService');
    throw error;
  }
};
export const getExerciseById = async (exerciseId: string) => {
  try {
    if (isCustomExerciseId(exerciseId)) {
      const [customExercise] = await getCustomExercisesByIds([toRawCustomExerciseId(exerciseId)]);
      return customExercise;
    }
    const { data, error } = await supabase
      .from('exercises_v2')
      .select('*')
      .eq('exerciseId', exerciseId)
      .single();
    if (error) throw error;
    return data as Exercise;
  } catch (error) {
    logError(error, 'exercisesService');
    throw error;
  }
};
export const getExerciseByIds = async (exerciseId: string[]) => {
  try {
    const catalogIds = exerciseId.filter((id) => !isCustomExerciseId(id));
    const customRawIds = exerciseId.filter(isCustomExerciseId).map(toRawCustomExerciseId);

    const [catalogExercises, customExercises] = await Promise.all([
      catalogIds.length
        ? supabase
            .from('exercises_v2')
            .select('*')
            .in('exerciseId', catalogIds)
            .then(({ data, error }) => {
              if (error) throw error;
              return data as Exercise[];
            })
        : Promise.resolve([] as Exercise[]),
      customRawIds.length ? getCustomExercisesByIds(customRawIds) : Promise.resolve([] as Exercise[]),
    ]);

    return [...catalogExercises, ...customExercises];
  } catch (error) {
    logError(error, 'exercisesService');
    throw error;
  }
};
