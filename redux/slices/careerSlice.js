import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadCareers as loadCareersFromDB, saveCareers as saveCareersToDb } from '@/utils/indexedDB';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const loadCareers = createAsyncThunk(
  'careers/loadCareers',
  async () => {
    const careers = await loadCareersFromDB();
    return careers;
  }
);

export const saveCareers = createAsyncThunk(
  'careers/saveCareers',
  async (careers, { dispatch }) => {
    try {
      await saveCareersToDb(careers);
      await dispatch(loadCareers());
      return careers;
    } catch (error) {
      throw error;
    }
  }
);

const careerSlice = createSlice({
  name: 'careers',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addCareer: (state, action) => {
      state.items.push(action.payload);
    },
    updateCareer: (state, action) => {
      const index = state.items.findIndex(career => career.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCareer: (state, action) => {
      state.items = state.items.filter(career => career.id !== action.payload);
    },
    reorderCareers: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCareers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadCareers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadCareers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveCareers.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addCareer, updateCareer, deleteCareer, reorderCareers } = careerSlice.actions;

export default careerSlice.reducer;