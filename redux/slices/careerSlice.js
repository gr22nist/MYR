import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as IndexedDB from '@/utils/indexedDB';

export const loadCareers = createAsyncThunk(
  'careers/loadCareers',
  async (_, { rejectWithValue }) => {
    try {
      const careers = await IndexedDB.loadCareers();
      return careers.length > 0 ? careers : [{
        id: `career-${Date.now()}`,
        companyName: '',
        position: '',
        period: '',
        tasks: ''
      }];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveCareers = createAsyncThunk(
  'careers/saveCareers',
  async (careers, { rejectWithValue }) => {
    try {
      await IndexedDB.saveCareers(careers);
      return careers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const careerSlice = createSlice({
  name: 'careers',
  initialState: {
    items: [{
      id: `career-${Date.now()}`,
      companyName: '',
      position: '',
      period: '',
      tasks: ''
    }],
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
      if (state.items.length === 0) {
        state.items.push({
          id: `career-${Date.now()}`,
          companyName: '',
          position: '',
          period: '',
          tasks: ''
        });
      }
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
        state.error = action.payload;
      })
      .addCase(saveCareers.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addCareer, updateCareer, deleteCareer, reorderCareers } = careerSlice.actions;

export default careerSlice.reducer;