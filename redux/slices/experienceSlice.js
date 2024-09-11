import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  experience: [],
};

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    addExperience: (state, action) => {
      state.experience.push(action.payload);
    },
    updateExperience: (state, action) => {
      const { id, data } = action.payload;
      const index = state.experience.findIndex((exp) => exp.id === id);
      if (index !== -1) state.experience[index] = data;
    },
    resetExperience: (state) => {
      return initialState;
    },
  },
});

export const { addExperience, updateExperience, resetExperience } = experienceSlice.actions;
export default experienceSlice.reducer;
