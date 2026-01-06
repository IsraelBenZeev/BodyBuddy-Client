import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Exercise } from '../types/exercise';

export const useGetExercisesFromCache = (ids: string[]) => {
  const queryClient = useQueryClient();
  return useMemo(() => {
    const allQueriesData = queryClient.getQueriesData({ queryKey: ['exercises'] });
    const flattened = allQueriesData.flatMap(([_, data]) => {
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object' && 'exercises' in data) return (data as any).exercises;
      return [];
    });
    const uniqueMap = new Map<string, Exercise>();
    flattened.forEach((ex: Exercise) => {
      if (ex?.exerciseId) uniqueMap.set(ex.exerciseId, ex);
    });
    return ids
      .map((id) => uniqueMap.get(id))
      .filter((ex): ex is Exercise => !!ex);
  }, [ids, queryClient]);
};