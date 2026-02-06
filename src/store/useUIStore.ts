// import { create } from 'zustand';

// interface UIState {
//   isSuccessVisible: boolean;
//   message: string;
//   type: 'success' | 'failed' | null;
//   triggerSuccess: (msg: string) => void;
//   hideSuccess: () => void;
// }

// export const useUIStore = create<UIState>((set) => ({
//   isSuccessVisible: false,
//   message: '',
//   type: null,
//   triggerSuccess: (msg) => set({ isSuccessVisible: true, message: msg, type: type }),
//   hideSuccess: () => set({ isSuccessVisible: false, message: '' }),
// }));


import { create } from 'zustand';

interface UIState {
  isSuccessVisible: boolean;
  message: string;
  type: 'success' | 'failed' | null;
  triggerSuccess: (msg: string, type: 'success' | 'failed') => void;
  hideSuccess: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSuccessVisible: false,
  message: '',
  type: null,
  triggerSuccess: (msg, type) => set({ isSuccessVisible: true, message: msg, type: type }),
  hideSuccess: () => set({ isSuccessVisible: false, message: '', type: null }), // איפוס ה-type בסגירה
}));