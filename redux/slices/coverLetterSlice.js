import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  letter: {
    title: '',
    content: '',
  },
};

const coverLetterSlice = createSlice({
  name: 'coverLetter',
  initialState,
  reducers: {
    updateLetter: (state, action) => {
      state.letter.content = action.payload;
    },
    resetLetter: (state) => {
      return initialState;
    },
  },
});

export const { updateLetter, resetLetter } = coverLetterSlice.actions;
export default coverLetterSlice.reducer;
