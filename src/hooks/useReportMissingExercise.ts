import { useMutation } from '@tanstack/react-query';
import { createExerciseReport } from '../service/reportService';
import { useUIStore } from '../store/useUIStore';
import { CreateExerciseReportPayload } from '../types/exerciseReport';

export const useReportMissingExercise = (userId: string | undefined) => {
  const { triggerSuccess } = useUIStore();

  return useMutation({
    mutationFn: async (payload: CreateExerciseReportPayload) => {
      await createExerciseReport(userId!, payload);
    },
    onSuccess: () => {
      triggerSuccess('תודה! קיבלנו את הדיווח', 'success');
    },
    onError: () => {
      triggerSuccess('שגיאה בשליחת הדיווח', 'failed');
    },
  });
};
