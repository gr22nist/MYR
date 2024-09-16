import Dexie from 'dexie';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const db = new Dexie('ResumeDB');
db.version(1).stores({
  careers: '++id',
  personalInfo: '++id',
  profilePhotos: 'key',
  profileTexts: 'key',
  resumeData: 'key'
});

export const saveCareers = async (careers) => {
  await db.careers.clear();
  await db.careers.bulkAdd(careers);
};

export const loadCareers = async () => {
  return db.careers.toArray();
};

export const savePersonalInfo = async (personalInfo) => {
  await db.personalInfo.clear();
  await db.personalInfo.add(personalInfo);
};

export const loadPersonalInfo = async () => {
  const allPersonalInfo = await db.personalInfo.toArray();
  return allPersonalInfo[0] || { items: [], isExpanded: false };
};

export const addItem = async (storeName, key, data, encrypt = true) => {
  const value = encrypt ? encryptData(data) : data;
  await db[storeName].put({ key, value });
};

export const getItem = async (storeName, key, decrypt = true) => {
  const item = await db[storeName].get(key);
  if (item) {
    if (decrypt) {
      const decryptedData = decryptData(item.value);
      if (decryptedData === null) {
        console.warn(`Failed to decrypt data for key "${key}" in store "${storeName}". Returning raw value.`);
        return item.value;
      }
      return decryptedData;
    }
    return item.value;
  }
  return null;
};

export const deleteItem = async (storeName, key) => {
  await db[storeName].delete(key);
};

export const addImage = async (key, value) => {
  return addItem('profilePhotos', key, value, false);
};

export const getImage = async (key) => {
  return getItem('profilePhotos', key, false);
};

export const deleteImage = async (key) => {
  return deleteItem('profilePhotos', key);
};

export const addEncryptedText = async (storeName, key, value) => {
  return addItem(storeName, key, value, true);
};

export const getEncryptedText = async (storeName, key) => {
  return getItem(storeName, key, true);
};

export const getEncryptedItem = async (storeName, key) => {
  const encryptedData = await getItem(storeName, key);
  if (!encryptedData) return null;
  const decryptedData = decryptData(encryptedData);
  if (decryptedData === null) {
    console.warn(`Failed to decrypt data for key "${key}" in store "${storeName}". Returning null.`);
    return null;
  }
  return decryptedData;
};

export const addEncryptedItem = async (storeName, key, value) => {
  const encryptedValue = encryptData(value);
  await addItem(storeName, key, encryptedValue);
};