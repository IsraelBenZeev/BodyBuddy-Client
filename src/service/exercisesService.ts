import { supabase } from '../../supabase_client';
import { Exercise } from '../types';
export const getExercisesByBodyPart = async (bodyPart: string, page: number, limit: number) => {
  console.log('limit: ', limit);

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const cleanedBodyPart = bodyPart.trim().toLowerCase();
  try {
    const { data, error, count } = await supabase
      .from('exercises')
      .select('*', { count: 'exact' })
      .contains('bodyParts', [cleanedBodyPart])
      .range(from, to);
    // בתוך ה-Service
    console.log(
      `DEBUG: page=${page}, limit=${limit}, from=${from}, to=${to}, part=${cleanedBodyPart}`
    );
    // console.log('data_service: ', data);

    if (error) throw error;
    return { exercises: data as Exercise[], totalCount: count || 0 };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
