import { create } from 'zustand';

interface UIState {
  isSuccessVisible: boolean;
  message: string;
  triggerSuccess: (msg: string) => void;
  hideSuccess: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSuccessVisible: false,
  message: '',
  triggerSuccess: (msg) => set({ isSuccessVisible: true, message: msg }),
  hideSuccess: () => set({ isSuccessVisible: false, message: '' }),
}));