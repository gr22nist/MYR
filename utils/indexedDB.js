import Dexie from 'dexie';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const db = new Dexie('ResumeDB');

const initializeDB = async () => {
  try {
    db.version(13).stores({
      careers: '++id',
      educations: '++id',
      userInfo: 'key',
      profilePhotos: 'key',
      profileTexts: 'key',
      resumeData: 'key'
    });
    await db.open();
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

initializeDB();

export const saveCareers = async (careers) => {
  try {
    await db.transaction('rw', db.careers, async () => {
      await db.careers.clear();
      for (const career of careers) {
        if (career.id) {
          await db.careers.put(career);
        } else {
          delete career.id;  // id가 없는 경우 자동 생성을 위해 제거
          await db.careers.add(career);
        }
      }
    });
  } catch (error) {
    console.error('Error saving careers:', error);
    throw error;
  }
};

export const loadCareers = async () => {
  return db.careers.toArray();
};

export const saveEducations = async (educations) => {
  await db.educations.clear();
  await db.educations.bulkAdd(educations);
};

export const loadEducations = async () => {
  return db.educations.toArray();
};

export const saveuserInfo = async (userInfo) => {
  await db.userInfo.clear();
  await db.userInfo.add(userInfo);
};

export const loaduserInfo = async () => {
  const alluserInfo = await db.userInfo.toArray();
  return alluserInfo[0] || { items: [], isExpanded: false };
};

export const addItem = async (storeName, key, data, encrypt = true) => {
  try {
    if (!db.isOpen()) {
      await db.open();
    }
    if (!db[storeName]) {
      throw new Error(`Object store "${storeName}" not found.`);
    }
    const value = encrypt ? encryptData(data) : data;
    await db[storeName].put({ key, value });
    return value;
  } catch (error) {
    console.error(`Error in addItem (${storeName}, ${key}):`, error);
    throw error;
  }
};

export const getItem = async (storeName, key, decrypt = true) => {
  try {
    if (!db.isOpen()) {
      await db.open();
    }
    if (!db[storeName]) {
      throw new Error(`Object store "${storeName}" not found.`);
    }
    const item = await db[storeName].get(key);
    if (item && item.value) {
      if (decrypt) {
        try {
          return decryptData(item.value);
        } catch (decryptError) {
          console.warn(`Failed to decrypt data for key "${key}" in store "${storeName}". Returning raw value.`);
          return item.value;
        }
      }
      return item.value;
    }
    return null;
  } catch (error) {
    console.error(`Error in getItem (${storeName}, ${key}):`, error);
    throw error;
  }
};

export const deleteItem = async (storeName, key) => {
  try {
    await db[storeName].delete(key);
  } catch (error) {
    console.error('Error deleting item from the store', error);
    throw error;
  }
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

export const saveCustomSections = async (sections) => {
  await db.customSections.clear();
  await db.customSections.bulkAdd(sections);
};

export const loadCustomSections = async () => {
  return db.customSections.toArray();
};

export const clearDatabase = async () => {
  try {
    if (!db.isOpen()) {
      await db.open();
    }
    await db.careers.clear();
    await db.educations.clear();
    await db.userInfo.clear();
    await db.profilePhotos.clear();
    await db.profileTexts.clear();
    await db.resumeData.clear();
    if (db.customSections) {
      await db.customSections.clear();
    }
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류 발생:', error);
    throw error;
  }
};