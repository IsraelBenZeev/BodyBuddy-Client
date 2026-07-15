export type ExerciseReportStatus = 'pending' | 'reviewed' | 'added' | 'dismissed';

export interface ExerciseReport {
  id: string;
  user_id: string;
  search_query: string;
  suggested_name: string | null;
  note: string | null;
  status: ExerciseReportStatus;
  created_at: string;
}

export interface CreateExerciseReportPayload {
  search_query: string;
  suggested_name?: string | null;
  note?: string | null;
}
