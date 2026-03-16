import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { addFavorite, getFavoriteIds, getExerciseByIds, getExercisesByBodyParts, removeFavorite } from '../service/exercisesService';
import { BodyPart } from '../types/bodtPart';
import { Exercise } from '../types/exercise';
const limit = 30;
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

export const useFavoriteIds = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavoriteIds(userId!),
    staleTime: Infinity,
    enabled: !!userId,
  });
};

export const useToggleFavorite = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ exerciseId, isFav }: { exerciseId: string; isFav: boolean }) =>
      isFav ? removeFavorite(userId!, exerciseId) : addFavorite(userId!, exerciseId),
    onMutate: async ({ exerciseId, isFav }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', userId] });
      const prev = queryClient.getQueryData<string[]>(['favorites', userId]);
      queryClient.setQueryData<string[]>(['favorites', userId], (old = []) =>
        isFav ? old.filter((id) => id !== exerciseId) : [...old, exerciseId]
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['favorites', userId], ctx?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });
};

