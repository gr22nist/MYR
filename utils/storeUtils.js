import { generateUUID } from './uuid';
import { encryptData, decryptData } from './cryptoUtils';

export const createBaseActions = (storeName, loadFromDB, saveToDB) => ({
  load: (set) => async () => {
    set({ status: 'loading' });
    try {
      const data = await loadFromDB();
      const decryptedData = data.map(item => ({
        ...item,
        ...decryptData(item.value)
      }));
      set({ [storeName]: decryptedData, status: 'succeeded' });
    } catch (error) {
      set({ status: 'failed', error: error.message });
    }
  },

  add: (set, get) => (newItem) => {
    set(state => {
      const items = state[storeName];
      const itemWithId = { ...newItem, id: generateUUID() };
      const updatedItems = [...items, itemWithId];
      saveToDB(updatedItems.map(item => ({
        id: item.id,
        value: encryptData(item)
      })));
      return { [storeName]: updatedItems };
    });
  },

  update: (set, get) => (updatedItem) => {
    set(state => {
      const items = state[storeName];
      const updatedItems = items.map(item => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      );
      saveToDB(updatedItems.map(item => ({
        id: item.id,
        value: encryptData(item)
      })));
      return { [storeName]: updatedItems };
    });
  },

  remove: (set, get) => (id) => {
    set(state => {
      const items = state[storeName];
      const updatedItems = items.filter(item => item.id !== id);
      saveToDB(updatedItems.map(item => ({
        id: item.id,
        value: encryptData(item)
      })));
      return { [storeName]: updatedItems };
    });
  },

  reorder: (set, get) => (oldIndex, newIndex) => {
    set(state => {
      const items = state[storeName];
      const updatedItems = [...items];
      const [reorderedItem] = updatedItems.splice(oldIndex, 1);
      updatedItems.splice(newIndex, 0, reorderedItem);
      const reorderedItems = updatedItems.map((item, index) => ({ ...item, order: index }));
      saveToDB(reorderedItems.map(item => ({
        id: item.id,
        value: encryptData(item)
      })));
      return { [storeName]: reorderedItems };
    });
  },

  reset: (set) => (initialState) => {
    set({ [storeName]: initialState, status: 'idle', error: null });
    saveToDB([]);
  },
});
