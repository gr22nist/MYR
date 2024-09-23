import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadEducations as loadEducationsFromDB, saveEducations as saveEducationsToDb } from '@/utils/indexedDB';

export const loadEducations = createAsyncThunk(
  'educations/loadEducations',
  async () => {
    const educations = await loadEducationsFromDB();
    return educations;
  }
);

export const saveEducations = createAsyncThunk(
  'educations/saveEducations',
  async (educations, { dispatch }) => {
    try {
      await saveEducationsToDb(educations);
      await dispatch(loadEducations());
      return educations;
    } catch (error) {
      throw error;
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
    reorderEducations: (state, action) => {
      state.items = action.payload;
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
        state.error = action.error.message;
      })
      .addCase(saveEducations.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addEducation, updateEducation, deleteEducation, reorderEducations } = educationSlice.actions;

export default educationSlice.reducer;
