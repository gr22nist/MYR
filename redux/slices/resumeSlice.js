// redux/slices/resumeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setAutoSaving, setLastSavedTime, showToast } from './globalSlice';

const initialState = {
  profile: {
    title: '',
    paragraph: '',
    imageUrl: '',
  },
  career: [],
  lastSavedDraft: null,
};

export const saveResumeDraft = createAsyncThunk(
  'resume/saveResumeDraft',
  async (_, { getState, dispatch }) => {
    try {
      dispatch(setAutoSaving(true));
      const state = getState().resume;
      // API 호출 또는 로컬 스토리지 저장 로직
      // 예: await api.saveResumeDraft(state);
      const savedTime = new Date().toISOString();
      dispatch(setLastSavedTime(savedTime));
      dispatch(showToast({ message: '임시저장 완료', type: 'success' }));
      return { savedTime, data: state };
    } catch (error) {
      dispatch(showToast({ message: '임시저장 실패', type: 'error' }));
      throw error;
    } finally {
      dispatch(setAutoSaving(false));
    }
  }
);

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
      state.lastSavedDraft = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveResumeDraft.fulfilled, (state, action) => {
        state.lastSavedDraft = action.payload.savedTime;
      })
      .addCase(saveResumeDraft.rejected, (state, action) => {
        // 임시저장 실패 시 추가 로직 (필요한 경우)
      });
  },
});

export const { setProfileData, setCareerData, updateProfile, resetResume } = resumeSlice.actions;
export default resumeSlice.reducer;