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

export const targetMuscleToBodyParts: Record<string, BodyPart[]> = {
  abductors: ['upper legs'],
  abs: ['waist'],
  adductors: ['upper legs'],
  biceps: ['upper arms'],
  calves: ['lower legs'],
  'cardiovascular system': [],
  delts: ['shoulders'],
  forearms: ['lower arms'],
  glutes: ['upper legs'],
  hamstrings: ['upper legs'],
  lats: ['back'],
  'levator scapulae': ['neck'],
  pectorals: ['chest'],
  quads: ['upper legs'],
  'serratus anterior': ['chest'],
  spine: ['back'],
  traps: ['back'],
  triceps: ['upper arms'],
  'upper back': ['back'],
};

export const BACK_BODY_MUSCLES = new Set([
  'glutes', 'hamstrings', 'lats', 'upper back', 'traps', 'spine', 'levator scapulae',
]);

export const FRONT_BODY_MUSCLES = new Set([
  'abs', 'pectorals', 'serratus anterior', 'quads', 'biceps',
]);

export const targetMusclesHebrew: Record<string, string> = {
  abductors: 'מרחיקים',
  abs: 'בטן',
  adductors: 'מקרבים',
  biceps: 'יד קדמית',
  calves: 'שוק',
  'cardiovascular system': 'לב וריאות',
  delts: 'דלתואיד',
  forearms: 'אמה',
  glutes: 'ישבן',
  hamstrings: 'ירך אחורית',
  lats: 'גב רחב',
  'levator scapulae': 'שריר הכתף',
  pectorals: 'חזה',
  quads: 'ירך קדמית',
  'serratus anterior': 'שריר הסרט',
  spine: 'עמוד שדרה',
  traps: 'טרפז',
  triceps: 'יד אחורית',
  'upper back': 'גב עליון',
};

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
