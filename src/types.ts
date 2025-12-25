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
  waist: 'מותן',
  'upper legs': 'רגל עליונה',
  'lower legs': 'רגל תחתונה',
  back: 'גב',
  general: 'כללי',
};
export interface Exercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: BodyPart;
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}
export interface ExerciseApiResponse {
  success: boolean;
  metadata: {
    totalPages: number;
    totalExercises: number;
    currentPage: number;
    previousPage: string | null;
    nextPage: string | null;
  };
  data: Exercise[];
}
