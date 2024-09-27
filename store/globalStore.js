import { create } from 'zustand';
import { updateDarkModeClass } from '@/utils/darkModeUtils';

const useGlobalStore = create((set) => ({
  isDarkMode: false,
  toastMessage: '',
  toastType: 'success',
  toastVisible: false,
  user: null,
  isAutoSaving: false,
  lastSavedTime: null,

  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.isDarkMode;
    updateDarkModeClass(newDarkMode);
    return { isDarkMode: newDarkMode };
  }),

  setDarkMode: (isDarkMode) => set(() => {
    updateDarkModeClass(isDarkMode);
    return { isDarkMode };
  }),

  showToast: ({ message, type = 'success' }) => set(() => ({
    toastMessage: message,
    toastType: type,
    toastVisible: true,
  })),

  hideToast: () => set(() => ({ toastVisible: false })),

  setUser: (user) => set(() => ({ user })),

  setAutoSaving: (isAutoSaving) => set(() => ({ isAutoSaving })),

  setLastSavedTime: (lastSavedTime) => set(() => ({ lastSavedTime })),

  resetGlobal: () => set(() => ({
    isDarkMode: false,
    toastMessage: '',
    toastType: 'success',
    toastVisible: false,
    user: null,
    isAutoSaving: false,
    lastSavedTime: null,
  })),
}));

export default useGlobalStore;
