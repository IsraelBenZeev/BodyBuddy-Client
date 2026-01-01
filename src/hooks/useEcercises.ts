import { useQuery } from '@tanstack/react-query';
import { getExerciseByIds, getExercisesByBodyPart } from '../service/exercisesService';

export const useExercises = (bodyPart: string, page: number) => {
  return useQuery({
    queryKey: ['exercises', bodyPart, page],
    queryFn: () => getExercisesByBodyPart(bodyPart, page, 30),
    staleTime: Infinity,
    enabled: !!bodyPart,
  });
};
export const useExerciseByIds = (exerciseIds: string[]) => {
  return useQuery({
    queryKey: ['exercises', 'workout', exerciseIds],
    queryFn: () => getExerciseByIds(exerciseIds),
    staleTime: Infinity,
    enabled: !!exerciseIds.length,
  });
};
