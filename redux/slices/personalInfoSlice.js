import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { personalInfoDB } from '../../hooks/usePersonalInfoDB';

export const loadPersonalInfo = createAsyncThunk(
  'personalInfo/loadPersonalInfo',
  async () => {
    const data = await personalInfoDB.fetchPersonalInfo();
    return data || { items: [], isExpanded: false };
  }
);

export const savePersonalInfo = createAsyncThunk(
  'personalInfo/savePersonalInfo',
  async (personalInfo, { getState }) => {
    const { personalInfo: currentState } = getState();
    const updatedState = {
      ...currentState,
      items: personalInfo.id 
        ? currentState.items.map(item => item.id === personalInfo.id ? personalInfo : item)
        : [...currentState.items, { ...personalInfo, id: Date.now() }]
    };
    await personalInfoDB.savePersonalInfoToDb(updatedState);
    return updatedState;
  }
);

const personalInfoSlice = createSlice({
  name: 'personalInfo',
  initialState: {
    items: [],
    isExpanded: false,
    status: 'idle',
  },
  reducers: {
    toggleExpanded: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPersonalInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadPersonalInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
        state.isExpanded = action.payload.isExpanded || false;
      })
      .addCase(loadPersonalInfo.rejected, (state) => {
        state.status = 'failed';
        state.items = [];
        state.isExpanded = false;
      })
      .addCase(savePersonalInfo.fulfilled, (state, action) => {
        state.items = action.payload.items;
      });
  },
});

export const { toggleExpanded, addItem, updateItem, removeItem } = personalInfoSlice.actions;

export default personalInfoSlice.reducer;
