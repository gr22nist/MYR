// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import customSectionReducer from './slices/customSectionSlice';
import resumeReducer from './slices/resumeSlice';
import careerReducer from './slices/careerSlice';
import educationReducer from './slices/educationSlice';
import coverLetterReducer from './slices/coverLetterSlice';
import experienceReducer from './slices/experienceSlice';
import globalReducer from './slices/globalSlice';
import userInfoReducer from './slices/userInfoSlice';
import { useCareerDB } from '../hooks/useCareerDB';

const store = configureStore({
  reducer: {
    customSections: customSectionReducer,
    resume: resumeReducer,
    careers: careerReducer,
    educations: educationReducer,
    coverLetter: coverLetterReducer,
    experience: experienceReducer,
    global: globalReducer,
    userInfo: userInfoReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        useCareerDB,
      },
    },
  }),
});

export default store;