// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './slices/resumeSlice';
import careerReducer from './slices/careerSlice';
import coverLetterReducer from './slices/coverLetterSlice';
import experienceReducer from './slices/experienceSlice';
import globalReducer from './slices/globalSlice';
import personalInfoReducer from './slices/personalInfoSlice';

const store = configureStore({
  reducer: {
    resume: resumeReducer,
    careers: careerReducer,
    coverLetter: coverLetterReducer,
    experience: experienceReducer,
    global: globalReducer,
    personalInfo: personalInfoReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      // 필요한 경우 특정 액션이나 경로를 무시하도록 설정할 수 있습니다.
      // ignoredActions: ['some/action'],
      // ignoredPaths: ['some.path'],
    },
  }),
});

export default store;