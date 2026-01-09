import { create } from 'zustand';
interface WorkoutsState {
  selectedExerciseIds: string[];
  toggleExercise: (id: string | string[]) => void;
  isExerciseSelected: (id: string) => boolean;
  clearAllExercises: () => void;
}

export const useWorkoutStore = create<WorkoutsState>((set, get) => ({
  selectedExerciseIds: [],
  // toggleExercise: (id) =>
  //   set((state) => ({
  //     selectedExerciseIds: state.selectedExerciseIds.includes(id)
  //       ? state.selectedExerciseIds.filter((exId) => exId !== id)
  //       : [...state.selectedExerciseIds, id],
  //   })),
  toggleExercise: (input) => {
    set((state) => {
      const idsToToggle = Array.isArray(input) ? input : [input];
      let newSelectedIds = [...state.selectedExerciseIds];

      idsToToggle.forEach((id) => {
        if (newSelectedIds.includes(id)) {
          newSelectedIds = newSelectedIds.filter((exId) => exId !== id);
        } else {
          newSelectedIds.push(id);
        }
      });

      const uniqueIds = Array.from(new Set(newSelectedIds));

      return { selectedExerciseIds: uniqueIds };
    })
  },
  isExerciseSelected: (id) => get().selectedExerciseIds.includes(id),
  clearAllExercises: () => set({ selectedExerciseIds: [] }),
}));
