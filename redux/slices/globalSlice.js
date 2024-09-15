import { createSlice } from '@reduxjs/toolkit';
import { updateDarkModeClass } from '@/utils/darkModeUtils';

const initialState = {
  isDarkMode: false,
  toastMessage: '',
  toastType: 'success',
  toastVisible: false,
  user: null,
  // 임시저장 관련 상태 추가
  isAutoSaving: false,
  lastSavedTime: null,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // 기존 리듀서들...
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      updateDarkModeClass(state.isDarkMode);
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      updateDarkModeClass(state.isDarkMode);
    },
    showToast: (state, action) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
      state.toastVisible = true;
    },
    hideToast: (state) => {
      state.toastMessage = '';
      state.toastVisible = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // 임시저장 관련 리듀서 추가
    setAutoSaving: (state, action) => {
      state.isAutoSaving = action.payload;
    },
    setLastSavedTime: (state, action) => {
      state.lastSavedTime = action.payload;
    },
    resetGlobal: () => initialState,
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  showToast,
  hideToast,
  setUser,
  resetGlobal,
  // 새로운 액션 추가
  setAutoSaving,
  setLastSavedTime,
} = globalSlice.actions;

export default globalSlice.reducer;