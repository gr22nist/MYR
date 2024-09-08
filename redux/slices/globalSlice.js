import { createSlice } from '@reduxjs/toolkit';
import { updateDarkModeClass } from '@/utils/darkModeUtils'; // 외부 유틸리티로 분리

const initialState = {
  isDarkMode: false,
  toastMessage: '',
  toastType: 'success',
  toastVisible: false, // 토스트가 현재 표시 중인지 여부
  user: null, // 사용자 정보 (다른 상태 관리)
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      updateDarkModeClass(state.isDarkMode); // 다크 모드 전환 시 HTML 클래스 변경
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      updateDarkModeClass(state.isDarkMode);
    },
    showToast: (state, action) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
      state.toastVisible = true; // 토스트 메시지를 표시
    },
    hideToast: (state) => {
      state.toastMessage = '';
      state.toastVisible = false; // 토스트를 숨김
    },
    setUser: (state, action) => {
      state.user = action.payload; // 사용자 정보 업데이트
    },
    resetGlobal: (state) => {
      return initialState; // 글로벌 상태 초기화
    },
  },
});

export const { toggleDarkMode, setDarkMode, showToast, hideToast, setUser, resetGlobal } = globalSlice.actions;
export default globalSlice.reducer;
