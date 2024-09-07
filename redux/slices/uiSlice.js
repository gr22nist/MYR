import { createSlice } from '@reduxjs/toolkit';
import { updateDarkModeClass } from '@/utils/darkModeUtils'; // 외부 유틸리티로 분리

const initialState = {
  isDarkMode: false,
  toastMessage: '',
  toastType: 'success',
  toastVisible: false, // 토스트가 현재 표시 중인지 여부
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
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
      state.toastVisible = true; // 토스트를 보여줌
    },
    hideToast: (state) => {
      state.toastMessage = '';
      state.toastVisible = false; // 토스트를 숨김
    },
  },
});

export const { toggleDarkMode, setDarkMode, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;