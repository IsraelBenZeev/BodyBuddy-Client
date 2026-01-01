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
export interface FetchExercisesResponse {
  exercises: Exercise[];
  totalCount: number;
}

