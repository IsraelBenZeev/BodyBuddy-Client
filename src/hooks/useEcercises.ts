import { useQuery } from '@tanstack/react-query';
import { getExercisesByBodyParts } from '../service/exercisesService';
import { BodyPart } from '../types/bodtPart';
const limit = 80;
export const useExercises = (bodyParts: BodyPart[], page: number) => {
  return useQuery({
    queryKey: ['exercises', [...bodyParts].sort(), page],
    queryFn: () => getExercisesByBodyParts(bodyParts, page, limit),
    staleTime: Infinity,
    enabled: !!bodyParts,
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
