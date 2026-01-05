import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Exercise } from '../types/exercise';

export const useGetExercisesFromCache = (ids: string[]) => {
  console.log("ids", ids);
  
  const queryClient = useQueryClient();

  return useMemo(() => {
    // שליפת כל המידע שמתחיל ב-'exercises'
    const allQueriesData = queryClient.getQueriesData({ queryKey: ['exercises'] });

    // שימוש ב-Set/Map כדי לאסוף את כל התרגילים הייחודיים מהמטמון
    const flattened = allQueriesData.flatMap(([_, data]) => {
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object' && 'exercises' in data) return (data as any).exercises;
      return [];
    });

    // הסרת כפילויות על בסיס ID
    const uniqueMap = new Map<string, Exercise>();
    flattened.forEach((ex: Exercise) => {
      if (ex?.exerciseId) uniqueMap.set(ex.exerciseId, ex);
    });

    // החזרת האובייקטים לפי סדר ה-IDs שהתקבלו
    return ids
      .map((id) => uniqueMap.get(id))
      .filter((ex): ex is Exercise => !!ex);
  }, [ids, queryClient]); // המערך תלוי ב-IDs ששלחת וב-QueryClient
};