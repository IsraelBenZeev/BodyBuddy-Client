import { logError } from '@/src/lib/logger';
import { supabase } from '../../supabase_client';
import { partsBodyHebrew } from '../types/bodtPart';
import {
  CreateCustomExercisePayload,
  CUSTOM_EQUIPMENT_OPTIONS,
  toCustomExerciseId,
  UserCustomExercise,
} from '../types/customExercise';
import { Exercise } from '../types/exercise';

export const mapCustomExerciseToExercise = (row: UserCustomExercise): Exercise => {
  const equipmentLabelHe =
    CUSTOM_EQUIPMENT_OPTIONS.find((option) => option.value === row.equipment)?.label_he ?? row.equipment;

  return {
    exerciseId: toCustomExerciseId(row.id),
    name: row.name,
    name_he: row.name,
    bodyParts: [row.body_part],
    bodyParts_he: [partsBodyHebrew[row.body_part]],
    subBodyParts: [],
    subBodyParts_he: [],
    targetMuscles: row.target_muscle ? [row.target_muscle] : [],
    targetMuscles_he: row.target_muscle ? [row.target_muscle] : [],
    secondaryMuscles: [],
    secondaryMuscles_he: [],
    equipments: row.equipment ? [row.equipment] : [],
    equipments_he: equipmentLabelHe ? [equipmentLabelHe] : [],
    homeFriendly: row.home_friendly,
    instructions: row.notes ? [row.notes] : [],
    instructions_he: row.notes ? [row.notes] : [],
    imageUrls: [],
    videoUrl: null,
    gifUrl: null,
    created_at: row.created_at,
    gif_available: false,
    sort_order: Number.MAX_SAFE_INTEGER,
    idx: null,
  };
};

export const getUserCustomExercises = async (userId: string): Promise<Exercise[]> => {
  try {
    const { data, error } = await supabase
      .from('user_custom_exercises')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as UserCustomExercise[]).map(mapCustomExerciseToExercise);
  } catch (error) {
    logError(error, 'customExercisesService');
    throw error;
  }
};

// Intentionally NOT filtered by is_active — a soft-deleted custom exercise must still
// resolve by id so old workout plans / session logs that already reference it don't
// turn into a dead link. is_active only gates visibility in lists/search (see above).
export const getCustomExercisesByIds = async (rawIds: string[]): Promise<Exercise[]> => {
  try {
    const { data, error } = await supabase
      .from('user_custom_exercises')
      .select('*')
      .in('id', rawIds);
    if (error) throw error;
    return (data as UserCustomExercise[]).map(mapCustomExerciseToExercise);
  } catch (error) {
    logError(error, 'customExercisesService');
    throw error;
  }
};

export const createCustomExercise = async (
  userId: string,
  payload: CreateCustomExercisePayload
): Promise<Exercise> => {
  try {
    const { data, error } = await supabase
      .from('user_custom_exercises')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return mapCustomExerciseToExercise(data as UserCustomExercise);
  } catch (error) {
    logError(error, 'customExercisesService');
    throw error;
  }
};

export const deleteCustomExercise = async (rawId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_custom_exercises')
      .update({ is_active: false })
      .eq('id', rawId)
      .eq('user_id', userId);
    if (error) throw error;
  } catch (error) {
    logError(error, 'customExercisesService');
    throw error;
  }
};
