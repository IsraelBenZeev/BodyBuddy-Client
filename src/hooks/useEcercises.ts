import { supabase } from '@/supabase_client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getExercisesByBodyParts } from '../service/exercisesService';
import { BodyPart } from '../types/bodtPart';
import { Exercise } from '../types/exercise';
const limit = 30;
export const useExercises = (bodyParts: BodyPart[], page: number) => {
  return useQuery({
    queryKey: ['exercises', [...bodyParts].sort(), page],
    queryFn: () => getExercisesByBodyParts(bodyParts, page, limit),
    staleTime: Infinity,
    enabled: !!bodyParts,
  });
};


export const useGetExercisesByIds = (ids: string[]) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['exercises', 'selected', ids],
    queryFn: async () => {
      // 1. ננסה לאסוף כמה שיותר מהמטמון הקיים
      const allCached = queryClient.getQueriesData({ queryKey: ['exercises'] });
      const flattened = allCached.flatMap(([_, data]) => {
        if (Array.isArray(data)) return data;
        return (data as any)?.exercises || [];
      });

      const foundInCache = flattened.filter((ex: any) => ids.includes(ex.exerciseId));

      // 2. נבדוק אילו IDs חסרים לנו
      const foundIds = foundInCache.map((ex: any) => ex.exerciseId);
      const missingIds = ids.filter(id => !foundIds.includes(id));

      let fetchedData: Exercise[] = [];

      // 3. אם יש חסרים - נביא את החסרים מה-DB
      if (missingIds.length > 0) {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .in('exerciseId', missingIds);

        if (error) throw error;
        fetchedData = data || [];
      }

      // 4. נחזיר את האיחוד של שניהם
      const finalData = [...foundInCache, ...fetchedData];

      // 5. מיון מחדש לפי הסדר המקורי של ה-IDs (ומניעת כפילויות)
      return ids
        .map(id => finalData.find(ex => ex.exerciseId === id))
        .filter((ex): ex is Exercise => !!ex);
    },
    enabled: ids.length > 0, // אל תרוץ אם המערך ריק
    staleTime: 1000 * 60 * 5, // שמור את התוצאה ל-5 דקות
  });
};


// export const useExerciseByIds = (exerciseIds: string[]) => {
//   return useQuery({
//     queryKey: ['exercises', 'workout', exerciseIds],
//     queryFn: () => getExerciseByIds(exerciseIds),
//     staleTime: Infinity,
//     enabled: !!exerciseIds.length,
//   });
// };
