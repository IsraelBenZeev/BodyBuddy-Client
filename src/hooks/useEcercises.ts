import { useQuery } from '@tanstack/react-query';
import { getExercisesByBodyPart } from '../service/exercisesService';

export const useExercises = (bodyPart: string, page: number) => {
  return useQuery({
    queryKey: ['exercises', bodyPart, page],
    queryFn: () => getExercisesByBodyPart(bodyPart, page),
    staleTime: Infinity,
    enabled: !!bodyPart,
  });
};
