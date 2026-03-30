import { create } from 'zustand';

interface WorkoutsState {
  selectedExerciseIds: Set<string>;
  toggleExercise: (id: string | string[]) => void;
  isExerciseSelected: (id: string) => boolean;
  clearAllExercises: () => void;
  completedTimes: { [exerciseId: string]: (number | null)[] };
  setSetDone: (exerciseId: string, index: number) => void;
  addSetTime: (exerciseId: string) => void;
  removeSetTime: (exerciseId: string, index: number) => void;
  clearCompletedTimes: () => void;
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
  completedTimes: {},
  setSetDone: (exerciseId, index) => set((state) => {
    const times = state.completedTimes[exerciseId] ?? [];
    if (times[index] != null) return state;
    const next = [...times];
    next[index] = Date.now();
    return { completedTimes: { ...state.completedTimes, [exerciseId]: next } };
  }),
  addSetTime: (exerciseId) => set((state) => {
    const times = state.completedTimes[exerciseId] ?? [];
    return { completedTimes: { ...state.completedTimes, [exerciseId]: [...times, null] } };
  }),
  removeSetTime: (exerciseId, index) => set((state) => {
    const times = state.completedTimes[exerciseId] ?? [];
    return { completedTimes: { ...state.completedTimes, [exerciseId]: times.filter((_, i) => i !== index) } };
  }),
  clearCompletedTimes: () => set({ completedTimes: {} }),
}));
