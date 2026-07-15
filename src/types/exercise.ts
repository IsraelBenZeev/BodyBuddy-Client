export interface Exercise {
  exerciseId: string; // ה-ID הייחודי (למשל: "84RyJf8")
  name: string; // שם התרגיל באנגלית
  name_he: string; // שם התרגיל בעברית
  bodyParts: string[]; // מערך של חלקי גוף (למשל: ["shoulders"])
  bodyParts_he: string[]; // מערך חלקי גוף בעברית
  subBodyParts: string[]; // מערך של תת-חלקי גוף
  subBodyParts_he: string[]; // מערך תת-חלקי גוף בעברית
  targetMuscles: string[]; // שרירי מטרה
  targetMuscles_he: string[]; // שרירי מטרה בעברית
  secondaryMuscles: string[]; // שרירים משניים
  secondaryMuscles_he: string[];
  equipments: string[]; // ציוד נדרש
  equipments_he: string[];
  homeFriendly: boolean; // האם מתאים לאימון ביתי
  instructions: string[]; // מערך של שלבי ביצוע (ה-Step:1, Step:2 שראינו)
  instructions_he: string[]; // הוראות בעברית
  imageUrls: string[]; // תמונות סטטיות של התרגיל
  videoUrl: string | null; // לינק לסרטון הדגמה
  gifUrl: string | null; // לינק לאנימציה (מיושן, לא בשימוש ב-v2)
  created_at: string; // תאריך יצירה (ISO String)
  gif_available: boolean; // מיושן, לא בשימוש ב-v2
  sort_order: number;
  idx: number | null;
}
export interface FetchExercisesResponse {
  exercises: Exercise[];
  totalCount: number;
}

