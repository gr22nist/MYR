import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as IndexedDB from '@/utils/indexedDB';

export const loadEducations = createAsyncThunk(
  'educations/loadEducations',
  async (_, { rejectWithValue }) => {
    try {
      const educations = await IndexedDB.loadEducations();
      return educations.length > 0 ? educations : [{
        id: `education-${Date.now()}`,
        schoolName: '',
        major: '',
        period: '',
        graduationStatus: '재학중'
      }];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveEducations = createAsyncThunk(
  'educations/saveEducations',
  async (educations, { rejectWithValue }) => {
    try {
      await IndexedDB.saveEducations(educations);
      return educations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const educationSlice = createSlice({
  name: 'educations',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addEducation: (state, action) => {
      state.items.push(action.payload);
    },
    updateEducation: (state, action) => {
      const index = state.items.findIndex(education => education.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteEducation: (state, action) => {
      state.items = state.items.filter(education => education.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEducations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadEducations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadEducations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveEducations.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addEducation, updateEducation, deleteEducation } = educationSlice.actions;

export default educationSlice.reducer;
