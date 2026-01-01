export type BodyPart =
  | 'neck'
  | 'shoulders'
  | 'chest'
  | 'upper arms'
  | 'lower arms'
  | 'waist'
  | 'upper legs'
  | 'lower legs'
  | 'general'
  | 'back';

export const partsBodyHebrew = {
  neck: 'צוואר',
  chest: 'חזה',
  shoulders: 'כתפיים',
  'upper arms': 'יד עליונה',
  'lower arms': 'יד תחתונה',
  waist: 'בטן ומותניים',
  'upper legs': 'רגל עליונה',
  'lower legs': 'רגל תחתונה',
  back: 'גב',
  general: 'כללי',
};
export interface Exercise {
  exerciseId: string; // ה-ID הייחודי (למשל: "84RyJf8")
  name: string; // שם התרגיל באנגלית
  name_he: string; // שם התרגיל בעברית
  bodyParts: string[]; // מערך של חלקי גוף (למשל: ["shoulders"])
  bodyParts_he: string[]; // מערך חלקי גוף בעברית
  targetMuscles: string[]; // שרירי מטרה
  targetMuscles_he: string[]; // שרירי מטרה בעברית
  secondaryMuscles: string[]; // שרירים משניים
  secondaryMuscles_he: string[];
  equipments: string[]; // ציוד נדרש
  equipments_he: string[];
  instructions: string[]; // מערך של שלבי ביצוע (ה-Step:1, Step:2 שראינו)
  instructions_he: string[]; // הוראות בעברית
  gifUrl: string; // לינק לאנימציה
  created_at: string; // תאריך יצירה (ISO String)
}

// טיפוס נוסף עבור התגובה שחוזרת מהפונקציה שלך
export interface FetchExercisesResponse {
  exercises: Exercise[];
  totalCount: number;
}
export interface WorkoutPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  exerciseIds: string[]; // מערך של מזהי תרגילים
  time: number; // זמן משוער בדקות
  difficulty: number; // רמת קושי מ-1 עד 5
}
