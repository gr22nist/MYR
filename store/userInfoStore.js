import { create } from 'zustand';
import { createBaseActions } from '@/utils/storeUtils';
import { loadUserInfo as loadUserInfoFromDB, saveUserInfo as saveUserInfoToDB } from '@/utils/indexedDB';
import { generateUUID } from '@/utils/uuid';
import { typeToKorean } from '@/constants/resumeConstants';

const useUserInfoStore = create((set, get) => ({
  items: [], // 초기 상태를 빈 배열로 변경
  status: 'idle',
  error: null,
  ...createBaseActions('items', loadUserInfoFromDB, saveUserInfoToDB),

  addUserInfo: (newItem) => {
    const newItemWithId = { 
      ...newItem, 
      id: generateUUID(),
      displayType: newItem.type === 'custom' ? newItem.value.title : typeToKorean[newItem.type]
    };
    set(state => {
      const updatedItems = [...state.items, newItemWithId];
      saveUserInfoToDB(updatedItems);
      return { items: updatedItems };
    });
  },

  updateUserInfo: (updatedItem) => {
    set(state => {
      const updatedItems = state.items.map(item => 
        item.id === updatedItem.id 
          ? {
              ...updatedItem,
              displayType: updatedItem.type === 'custom' ? updatedItem.value.title : typeToKorean[updatedItem.type]
            }
          : item
      );
      saveUserInfoToDB(updatedItems);
      return { items: updatedItems };
    });
  },

  removeUserInfo: (id) => {
    set(state => {
      const updatedItems = state.items.filter(item => item.id !== id);
      saveUserInfoToDB(updatedItems);
      return { items: updatedItems };
    });
  },

  reorderUserInfo: (oldIndex, newIndex) => {
    set(state => {
      const updatedItems = [...state.items];
      const [reorderedItem] = updatedItems.splice(oldIndex, 1);
      updatedItems.splice(newIndex, 0, reorderedItem);
      saveUserInfoToDB(updatedItems);
      return { items: updatedItems };
    });
  },

  resetUserInfo: () => {
    set(() => {
      saveUserInfoToDB([]);
      return { items: [] };
    });
  },

  loadUserInfo: async () => {
    set({ status: 'loading' });
    try {
      const loadedItems = await loadUserInfoFromDB();
      set({ items: loadedItems, status: 'success' });
    } catch (error) {
      console.error('Error loading user info in store:', error);
      set({ error: error.message, status: 'error' });
    }
  },

  saveUserInfo: () => {
    const { items } = get();
    saveUserInfoToDB(items);
  },
}));

export default useUserInfoStore;
