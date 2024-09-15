// redux/slices/resumeSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    title: '',
    paragraph: '',
    imageUrl: '',
  },
  career: [],
};


const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profile = action.payload;
    },
    setCareerData: (state, action) => {
      state.career = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    resetResume: (state) => {
      state.profile = initialState.profile;
      state.career = initialState.career;
    },
  },
});

export const { setProfileData, setCareerData, updateProfile, resetResume } = resumeSlice.actions;
export default resumeSlice.reducer;