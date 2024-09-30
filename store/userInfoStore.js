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
    set(state => {
      const updatedItems = [
        ...state.items, 
        { 
          ...newItem, 
          id: generateUUID(), 
          order: state.items.length,
          displayType: newItem.type === 'custom' ? newItem.value.title : (newItem.displayType || typeToKorean[newItem.type])
        }
      ];
      saveUserInfoToDB(updatedItems);
      return { items: updatedItems };
    });
  },

  updateUserInfo: (updatedItem) => {
    set(state => {
      const updatedItems = state.items.map(item => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
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
      const reorderedItems = updatedItems.map((item, index) => ({ ...item, order: index }));
      saveUserInfoToDB(reorderedItems);
      return { items: reorderedItems };
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
      const sortedItems = loadedItems.sort((a, b) => a.order - b.order);
      set({ items: sortedItems, status: 'success' });
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
