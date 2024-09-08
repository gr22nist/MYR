// redux/slices/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  paragraph: '',
  imageUrl: '',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return {
        ...state,
        ...action.payload, // 전달된 필드만 업데이트
      };
    },
    resetProfile: (state) => initialState, // 프로필 초기화
  },
});

export const { updateProfile, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
