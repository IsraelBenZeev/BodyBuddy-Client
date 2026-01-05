export type dayType = "א" | "ב" | "ג" | "ד" | "ה" | "ו" | "ש";
export interface WorkoutPlan {
  user_id: string;
  title: string;
  description?: string;
  exercise_ids: string[]; // מערך של מזהי תרגילים
  time: number; // זמן משוער בדקות
  difficulty: number; // רמת קושי מ-1 עד 5
  days_per_week: dayType[]; // מספר ימים בשבוע
}
export const daysInHebrew = {
    "א": 'ראשון',
    "ב": 'שני',
    "ג": 'שלישי',
    "ד": 'רביעי',
    "ה": 'חמישי',
    "ו": 'שישי',
    "ש": 'שבת',
  };
