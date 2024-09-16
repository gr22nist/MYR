import { useMemo } from 'react';
import * as IndexedDB from '@/utils/indexedDB';

export const useIndexedDB = () => {
  return useMemo(() => ({
    saveCareers: IndexedDB.saveCareers,
    loadCareers: IndexedDB.loadCareers,
    savePersonalInfo: IndexedDB.savePersonalInfo,
    loadPersonalInfo: IndexedDB.loadPersonalInfo,
    addItem: IndexedDB.addItem,
    getItem: IndexedDB.getItem,
    deleteItem: IndexedDB.deleteItem,
    addImage: IndexedDB.addImage,
    getImage: IndexedDB.getImage,
    deleteImage: IndexedDB.deleteImage,
    addEncryptedText: IndexedDB.addEncryptedText,
    getEncryptedText: IndexedDB.getEncryptedText,
    getEncryptedItem: IndexedDB.getEncryptedItem,
    addEncryptedItem: IndexedDB.addEncryptedItem
  }), []);
};
