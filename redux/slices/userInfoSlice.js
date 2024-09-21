import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveuserInfoToDb, loaduserInfoFromDb } from '@/hooks/useUserInfoDB';

export const loaduserInfo = createAsyncThunk(
  'userInfo/load',
  async (_, { rejectWithValue }) => {
    try {
      const data = await loaduserInfoFromDb();
      console.log('Loaded data from IndexedDB:', data);
      return data;
    } catch (error) {
      console.error('Error loading personal info:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const saveuserInfo = createAsyncThunk(
  'userInfo/save',
  async (newItem, { getState }) => {
    try {
      const { userInfo } = getState();
      const updatedItems = [...userInfo.items, newItem];
      const savedItem = await saveuserInfoToDb(updatedItems);
      console.log('Saved data to IndexedDB:', savedItem);
      
      // 저장 후 즉시 데이터를 다시 로드
      const loadedData = await loaduserInfoFromDb();
      console.log('Reloaded data after saving:', loadedData);
      
      return loadedData;
    } catch (error) {
      console.error('Error saving personal info:', error);
      throw error;
    }
  }
);

export const removeItem = createAsyncThunk(
  'userInfo/remove',
  async (itemId, { getState }) => {
    try {
      const { userInfo } = getState();
      const updatedItems = userInfo.items.filter(item => item.id !== itemId);
      await saveuserInfoToDb(updatedItems);
      console.log('Updated data after removal:', updatedItems);
      return updatedItems;
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  }
);

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loaduserInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loaduserInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        console.log('State updated after loading:', state.items);
      })
      .addCase(loaduserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveuserInfo.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        console.log('State updated after saving:', state.items);
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload;
        console.log('State updated after removal:', state.items);
      });
  },
});

export default userInfoSlice.reducer;
