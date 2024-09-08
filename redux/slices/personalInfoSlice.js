// redux/slices/personalInfoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contact: '',
  address: '',
  birthdate: '',
  email: '',
  salary: '',
  // 필요한 다른 필드들 추가
};

const personalInfoSlice = createSlice({
  name: 'personalInfo',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action) => {
      return {
        ...state,
        ...action.payload, // 전달된 필드만 업데이트
      };
    },
    resetPersonalInfo: (state) => initialState, // 개인정보 초기화
  },
});

export const { updatePersonalInfo, resetPersonalInfo } = personalInfoSlice.actions;
export default personalInfoSlice.reducer;
