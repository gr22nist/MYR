import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as IndexedDB from '@/utils/indexedDB';

export const loadCustomSections = createAsyncThunk(
  'customSections/loadCustomSections',
  async (_, { rejectWithValue }) => {
    try {
      const sections = await IndexedDB.loadCustomSections();
      return sections;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveCustomSection = createAsyncThunk(
  'customSections/saveCustomSection',
  async (section, { getState, dispatch }) => {
    try {
      const { customSections } = getState();
      const updatedSections = [...customSections.sections, section];
      await IndexedDB.saveCustomSections(updatedSections);
      return section;
    } catch (error) {
      throw error;
    }
  }
);

export const removeCustomSection = createAsyncThunk(
  'customSections/removeCustomSection',
  async (sectionId, { getState, dispatch }) => {
    try {
      const { customSections } = getState();
      const updatedSections = customSections.sections.filter(section => section.id !== sectionId);
      await IndexedDB.saveCustomSections(updatedSections);
      return sectionId;
    } catch (error) {
      throw error;
    }
  }
);

const customSectionSlice = createSlice({
  name: 'customSections',
  initialState: {
    sections: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCustomSections.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadCustomSections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sections = action.payload;
      })
      .addCase(loadCustomSections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveCustomSection.fulfilled, (state, action) => {
        state.sections.push(action.payload);
      })
      .addCase(removeCustomSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter(section => section.id !== action.payload);
      });
  },
});

export default customSectionSlice.reducer;
