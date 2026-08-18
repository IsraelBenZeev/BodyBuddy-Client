import { useMutation } from '@tanstack/react-query';
import { deleteAccount } from '../service/accountService';
import { supabase } from '@/supabase_client';

/** מחיקת חשבון לצמיתות – כולל כל הנתונים המשויכים, בלתי הפיך */
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await deleteAccount();
      if (error) throw error;
    },
    onSuccess: async () => {
      await supabase.auth.signOut();
    },
  });
};
