import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadCareers = createAsyncThunk(
  'careers/loadCareers',
  async () => {
    const savedCareers = localStorage.getItem('careers');
    return savedCareers ? JSON.parse(savedCareers) : [];  // 항상 배열을 반환해야 합니다.
  }
);

const initialState = {
  items: [],  // 이 부분이 중요합니다. items는 반드시 배열이어야 합니다.
  status: 'idle',
};

const careerSlice = createSlice({
  name: 'careers',
  initialState,
  reducers: {
    setCareers: (state, action) => {
      return action.payload;
    },
    addCareer: (state, action) => {
      state.push(action.payload);
    },
    updateCareer: (state, action) => {
      const index = state.findIndex(career => career.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteCareer: (state, action) => {
      return state.filter(career => career.id !== action.payload);
    },
    reorderCareers: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCareers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadCareers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = Array.isArray(action.payload) ? action.payload : [];  // 배열인지 확인 후 할당
      })
      .addCase(loadCareers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setCareers, addCareer, updateCareer, deleteCareer, reorderCareers } = careerSlice.actions;
export default careerSlice.reducer;