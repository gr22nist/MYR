import { create } from 'zustand';
import { loaduserInfo as loaduserInfoFromDB, saveuserInfo as saveuserInfoToDB } from '@/utils/indexedDB';

const useUserInfoStore = create((set, get) => ({
  items: [],
  status: 'idle',
  error: null,

  loadUserInfo: async () => {
    set({ status: 'loading' });
    try {
      const data = await loaduserInfoFromDB();
      set({ items: Array.isArray(data) ? data : [], status: 'succeeded', error: null });
    } catch (error) {
      set({ status: 'failed', error: error.message });
    }
  },

  saveUserInfo: async (newItem) => {
    try {
      const currentItems = get().items;
      const updatedItems = [...currentItems, { ...newItem, id: `userInfo-${Date.now()}` }];
      await saveuserInfoToDB(updatedItems);
      set({ items: updatedItems });
    } catch (error) {
      console.error('Error saving user info:', error);
      set({ status: 'failed', error: error.message });
    }
  },

  updateItem: async (updatedItem) => {
    try {
      const currentItems = get().items;
      const updatedItems = currentItems.map(item => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      );
      await saveuserInfoToDB(updatedItems);
      set({ items: updatedItems });
    } catch (error) {
      console.error('Error updating user info:', error);
      set({ status: 'failed', error: error.message });
    }
  },

  removeItem: async (itemId) => {
    try {
      const currentItems = get().items;
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      await saveuserInfoToDB(updatedItems);
      set({ items: updatedItems });
    } catch (error) {
      set({ status: 'failed', error: error.message });
    }
  },

  resetUserInfo: async () => {
    try {
      await saveuserInfoToDB([]);
      set({ items: [], status: 'idle' });
    } catch (error) {
      console.error('Failed to reset user info:', error);
    }
  },
}));

export default useUserInfoStore;
