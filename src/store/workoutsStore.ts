import { create } from 'zustand';
interface WorkoutsState {
  selectedExerciseIds: Set<string>;
  toggleExercise: (id: string | string[]) => void;
  isExerciseSelected: (id: string) => boolean;
  clearAllExercises: () => void;
}

export const useWorkoutStore = create<WorkoutsState>((set, get) => ({
  selectedExerciseIds: new Set(),
  toggleExercise: (input) => {
    set((state) => {
      const idsToToggle = Array.isArray(input) ? input : [input];
      const newSet = new Set(state.selectedExerciseIds);
      idsToToggle.forEach((id) => {
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      });
      return { selectedExerciseIds: newSet };
    });
  },
  isExerciseSelected: (id) => get().selectedExerciseIds.has(id),
  clearAllExercises: () => set({ selectedExerciseIds: new Set() }),
}));
