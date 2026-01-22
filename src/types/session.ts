export type SessionDBType = {
    id?: string;
    user_id: string;
    workout_plan_id: string;
    started_at: string;
    completed_at: string;
    total_time: number;
    notes: string;
    exercise?: ExerciseLogDBType[];
}
export type ExerciseLogDBType = {
    id?: string;
    user_id: string;
    session_id: string;
    exercise_id: string;
    set_number: number;
    reps: number;
    weight: number;
}
export type SessionFormData = {
    started_at: string;
    notes: string;
    exercises: {
        [exerciseId: string]: {
            sets: Array<{ weight: number; reps: number }>;
        };
    };
};