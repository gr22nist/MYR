import * as IndexedDB from '@/utils/indexedDB';

export const useIndexedDB = () => {
  return {
    saveCareers: IndexedDB.saveCareers,
    loadCareers: IndexedDB.loadCareers,
    saveEducations: IndexedDB.saveEducations,
    loadEducations: IndexedDB.loadEducations,
    saveuserInfo: IndexedDB.saveuserInfo,
    loaduserInfo: IndexedDB.loaduserInfo,
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
  };
};
