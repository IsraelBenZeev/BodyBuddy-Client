type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface WorkoutPlan {
  user_id: string;
  title: string;
  description?: string;
  exercise_ids: string[]; // מערך של מזהי תרגילים
  time: number; // זמן משוער בדקות
  difficulty: number; // רמת קושי מ-1 עד 5
  days_per_week: WeekDay[]; // מספר ימים בשבוע
}
export const daysInHebrew = {
  0: 'ראשון',
  1: 'שני',
  2: 'שלישי',
  3: 'רביעי',
  4: 'חמישי',
  5: 'שישי',
  6: 'שבת',
};
