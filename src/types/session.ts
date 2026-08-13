export type SessionDBType = {
    id?: string;
    user_id: string;
    workout_plan_id: string;
    started_at: string;
    completed_at: string;
    total_time: number;
    notes: string;
    exercise?: ExerciseSetDBType[];
}
export type ExerciseSetDBType = {
    id?: string;
    user_id: string;
    session_id: string;
    exercise_id: string;
    set_number: number;
    created_at?: string;
    workout_plan_id: string;
    values: Record<string, number>;
    is_completed?: boolean;
    rest_seconds?: number | null;
}
export type SessionFormData = {
    started_at: string;
    notes: string;
    exercises: {
        [exerciseId: string]: {
            sets: Array<Record<string, number>>;
        };
    };
};
