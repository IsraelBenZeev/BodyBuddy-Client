import { InputFieldDefinition } from '@/src/types/exercise';

export const formatSecondsAsMMSS = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const formatFieldValue = (field: InputFieldDefinition, value: number): string => {
  if (field.type === 'duration') return formatSecondsAsMMSS(value);
  return field.unit ? `${value} ${field.unit}` : `${value}`;
};

export const formatDurationHebrew = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m} דקות ${s} שניות`;
};

export const describeInputFields = (fields: InputFieldDefinition[]): string => {
  const keys = fields.map((field) => field.key);
  if (keys.length === 1 && keys[0] === 'reps') return 'משקל גוף';
  if (keys.includes('added_weight')) return 'משקל גוף';
  if (keys.includes('duration') && (keys.includes('speed') || keys.includes('incline'))) return 'קרדיו';
  if (keys.includes('duration')) return 'זמן / החזקה';
  if (keys.includes('weight')) return 'משקולות';
  return '';
};
