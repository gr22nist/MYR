// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './slices/resumeSlice';
import coverLetterReducer from './slices/coverLetterSlice';
import experienceReducer from './slices/experienceSlice';
import globalReducer from './slices/globalSlice';

const store = configureStore({
  reducer: {
    resume: resumeReducer,
    coverLetter: coverLetterReducer,
    experience: experienceReducer,
    global: globalReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // 프로덕션에서는 비활성화
});

export default store;