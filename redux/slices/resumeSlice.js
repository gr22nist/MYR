import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    title: '',
    paragraph: '',
    imageUrl: '',
  },
  personalInfo: {
    address: '',
    phone: '',
    email: '',
    salary: '',
    birthdate: '',
  },
  // 추가적으로 이력서 관련 상태들
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    resetResume: (state) => {
      return initialState;
    },
  },
});

export const { updateProfile, updatePersonalInfo, resetResume } = resumeSlice.actions;
export default resumeSlice.reducer;
