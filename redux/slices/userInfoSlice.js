import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { saveuserInfoToDb, loaduserInfoFromDb } from '@/hooks/useUserInfoDB';
import { v4 as uuidv4 } from 'uuid';

export const loaduserInfo = createAsyncThunk(
  'userInfo/load',
  async (_, { rejectWithValue }) => {
    try {
      const data = await loaduserInfoFromDb();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveuserInfo = createAsyncThunk(
  'userInfo/save',
  async (newItem, { getState }) => {
    try {
      const { userInfo } = getState();
      const itemWithId = { ...newItem, id: uuidv4() };
      const updatedItems = [...userInfo.items, itemWithId];
      await saveuserInfoToDb(updatedItems);
      
      // 저장 후 즉시 데이터를 다시 로드
      const loadedData = await loaduserInfoFromDb();
      
      return loadedData;
    } catch (error) {
      throw error;
    }
  }
);

export const updateItem = createAsyncThunk(
  'userInfo/update',
  async (updatedItem, { getState }) => {
    try {
      const { userInfo } = getState();
      const updatedItems = userInfo.items.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      await saveuserInfoToDb(updatedItems);
      
      // 저장 후 즉시 데이터를 다시 로드
      const loadedData = await loaduserInfoFromDb();
      
      return loadedData;
    } catch (error) {
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
      
      // 저장 후 즉시 데이터를 다시 로드
      const loadedData = await loaduserInfoFromDb();
      
      return loadedData;
    } catch (error) {
      throw error;
    }
  }
);

export const resetUserInfo = createAction('userInfo/reset');

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
      })
      .addCase(loaduserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveuserInfo.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default userInfoSlice.reducer;
