export type BodyPart =
  | 'neck'
  | 'shoulders'
  | 'chest'
  | 'upper arms'
  | 'lower arms'
  | 'waist'
  | 'upper legs'
  | 'lower legs'
  | 'glutes'
  | 'general'
  | 'cardio'
  | 'back';

export const targetMuscleToBodyParts: Record<string, BodyPart[]> = {
  abductors: ['upper legs'],
  abs: ['waist'],
  adductors: ['upper legs'],
  biceps: ['upper arms'],
  calves: ['lower legs'],
  'cardiovascular system': [],
  chest: ['chest'],
  delts: ['shoulders'],
  forearms: ['lower arms'],
  glutes: ['glutes'],
  hamstrings: ['upper legs'],
  lats: ['back'],
  'levator scapulae': ['neck'],
  pectorals: ['chest'],
  quads: ['upper legs'],
  quadriceps: ['upper legs'],
  'rear delts': ['shoulders'],
  'serratus anterior': ['chest'],
  shoulders: ['shoulders'],
  spine: ['back'],
  traps: ['back'],
  triceps: ['upper arms'],
  'upper back': ['back'],
};

export const BACK_BODY_MUSCLES = new Set([
  'glutes', 'hamstrings', 'lats', 'upper back', 'traps', 'spine', 'levator scapulae', 'rear delts',
]);

export const FRONT_BODY_MUSCLES = new Set([
  'abs', 'pectorals', 'serratus anterior', 'quads', 'quadriceps', 'biceps', 'chest',
]);

export const targetMusclesHebrew: Record<string, string> = {
  abductors: 'מרחיקים',
  abs: 'בטן',
  adductors: 'מקרבים',
  biceps: 'יד קדמית',
  calves: 'שוק',
  'cardiovascular system': 'לב וריאות',
  chest: 'חזה',
  delts: 'דלתואיד',
  forearms: 'אמה',
  glutes: 'ישבן',
  hamstrings: 'ירך אחורית',
  lats: 'גב רחב',
  'levator scapulae': 'שריר הכתף',
  pectorals: 'חזה',
  quads: 'ירך קדמית',
  quadriceps: 'ירך קדמית',
  'rear delts': 'כתף אחורית',
  'serratus anterior': 'שריר הסרט',
  shoulders: 'כתפיים',
  spine: 'עמוד שדרה',
  traps: 'טרפז',
  triceps: 'יד אחורית',
  'upper back': 'גב עליון',
};

export const partsBodyHebrew: Record<BodyPart, string> = {
  neck: 'צוואר',
  chest: 'חזה',
  shoulders: 'כתפיים',
  'upper arms': 'ידיים',
  'lower arms': 'אמות',
  waist: 'בטן',
  'upper legs': 'רגל',
  'lower legs': 'שוק',
  glutes: 'ישבן',
  back: 'גב',
  general: 'כללי',
  cardio: 'אירובי',
};
