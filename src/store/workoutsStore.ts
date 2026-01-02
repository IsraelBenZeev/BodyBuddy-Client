import { create } from 'zustand';
interface WorkoutsState {
  selectedExerciseIds: string[];
  toggleExercise: (id: string) => void;
  isExerciseSelected: (id: string) => boolean;
  clearAllExercises: () => void;
}

export const useWorkoutStore = create<WorkoutsState>((set, get) => ({
  selectedExerciseIds: [],
  toggleExercise: (id) =>
    set((state) => ({
      selectedExerciseIds: state.selectedExerciseIds.includes(id)
        ? state.selectedExerciseIds.filter((exId) => exId !== id)
        : [...state.selectedExerciseIds, id],
    })),
  isExerciseSelected: (id) => get().selectedExerciseIds.includes(id),
  clearAllExercises: () => set({ selectedExerciseIds: [] }),
}));
