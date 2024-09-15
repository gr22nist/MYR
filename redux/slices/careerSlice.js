import { createSlice } from '@reduxjs/toolkit';

const careerSlice = createSlice({
  name: 'careers',
  initialState: [],
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
});

export const { setCareers, addCareer, updateCareer, deleteCareer, reorderCareers } = careerSlice.actions;
export default careerSlice.reducer;