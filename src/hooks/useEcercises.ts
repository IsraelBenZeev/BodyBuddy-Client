import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { getExerciseByIds, getExercisesByBodyParts } from '../service/exercisesService';
import { BodyPart } from '../types/bodtPart';
import { Exercise } from '../types/exercise';
const limit = 30;
// export const useExercises = (user_id: string, bodyParts: BodyPart[], page: number) => {
//   return useQuery({
//     queryKey: ['exercises', [...bodyParts].sort(), page],
//     queryFn: () => getExercisesByBodyParts(bodyParts, page, limit),
//     staleTime: Infinity,
//     enabled: !!bodyParts,
//   });
// };

export const useExercises = (user_id: string, bodyParts: BodyPart[]) => {
  return useInfiniteQuery({
    queryKey: ['exercises', [...bodyParts].sort()],
    queryFn: ({ pageParam = 1 }) => getExercisesByBodyParts(bodyParts, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.exercises.length < limit ? undefined : allPages.length + 1;
    },
    staleTime: Infinity,
  });
};

export const useGetExercisesByIds = (ids: string[]) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['exercises', 'byIds', ids],
    queryFn: () => getExerciseByIds(ids),
    // כאן הקסם קורה:
    initialData: () => {
      // מחפשים במטמון הקיים תרגילים שמתאימים ל-IDs שלנו
      const allExercises = queryClient.getQueryData<Exercise[]>(['exercises']);
      if (!allExercises) return undefined;

      const filtered = allExercises.filter(ex => ids.includes(ex.exerciseId));

      // מחזירים נתונים מהמטמון רק אם מצאנו את הכל
      return filtered.length === ids.length ? filtered : undefined;
    },
    staleTime: Infinity,
    enabled: ids.length > 0,
  });
};

// export const useGetExercisesByIds = (ids: string[]) => {
//   const queryClient = useQueryClient();
//   return useQuery({
//     queryKey: ['exercises', 'selected', ids],
//     queryFn: async () => {
//       const allCached = queryClient.getQueriesData({ queryKey: ['exercises'] });
//       const flattened = allCached.flatMap(([_, data]) => {
//         if (Array.isArray(data)) return data;
//         return (data as any)?.exercises || [];
//       });

//       const foundInCache = flattened.filter((ex: any) => ids.includes(ex.exerciseId));

//       const foundIds = foundInCache.map((ex: any) => ex.exerciseId);
//       const missingIds = ids.filter(id => !foundIds.includes(id));

//       let fetchedData: Exercise[] = [];

//       if (missingIds.length > 0) {
//         const { data, error } = await supabase
//           .from('exercises')
//           .select('*')
//           .in('exerciseId', missingIds);

//         if (error) throw error;
//         fetchedData = data || [];
//       }

//       const finalData = [...foundInCache, ...fetchedData];

//       return ids
//         .map(id => finalData.find(ex => ex.exerciseId === id))
//         .filter((ex): ex is Exercise => !!ex);
//     },
//     enabled: ids.length > 0,
//     staleTime: 1000 * 60 * 5,
//   });
// };


// export const useExerciseByIds = (exerciseIds: string[]) => {
//   return useQuery({
//     queryKey: ['exercises', 'workout', exerciseIds],
//     queryFn: () => getExerciseByIds(exerciseIds),
//     staleTime: Infinity,
//     enabled: !!exerciseIds.length,
//   });
// };
