import Dexie from 'dexie';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const db = new Dexie('ResumeDB');

const initializeDB = async () => {
  try {
    db.version(14).stores({
      careers: '++id',
      educations: '++id',
      userInfo: 'key',
      profilePhotos: 'key',
      profileTexts: 'key',
      resumeData: 'key',
      customSections: '++id'
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
        const encryptedCareer = encryptData(career);
        if (career.id) {
          await db.careers.put({ id: career.id, value: encryptedCareer });
        } else {
          await db.careers.add({ value: encryptedCareer });
        }
      }
    });
  } catch (error) {
    console.error('경력 저장 중 오류 발생:', error);
    throw error;
  }
};

export const loadCareers = async () => {
  const encryptedCareers = await db.careers.toArray();
  return encryptedCareers.map(item => ({
    ...decryptData(item.value),
    id: item.id
  }));
};

export const saveEducations = async (educations) => {
  await db.educations.clear();
  const encryptedEducations = educations.map(edu => ({ value: encryptData(edu) }));
  await db.educations.bulkAdd(encryptedEducations);
};

export const loadEducations = async () => {
  const encryptedEducations = await db.educations.toArray();
  return encryptedEducations.map(item => ({
    ...decryptData(item.value),
    id: item.id
  }));
};

export const saveuserInfo = async (userInfo) => {
  try {
    await db.userInfo.clear();
    const encryptedUserInfo = encryptData(userInfo);
    await db.userInfo.add({ key: 'userInfo', value: encryptedUserInfo });
    console.log('User info saved successfully');
  } catch (error) {
    console.error('Error saving user info to IndexedDB:', error);
    throw error;
  }
};

export const loaduserInfo = async () => {
  try {
    const encryptedUserInfo = await db.userInfo.get('userInfo');
    if (encryptedUserInfo && encryptedUserInfo.value) {
      const decryptedUserInfo = decryptData(encryptedUserInfo.value);
      
      return Array.isArray(decryptedUserInfo) ? decryptedUserInfo : [];
    }
    return [];
  } catch (error) {
    console.error('Error loading user info:', error);
    throw error;
  }
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
  try {
    await db.transaction('rw', db.customSections, async () => {
      await db.customSections.clear();
      for (const section of sections) {
        const encryptedSection = encryptData(section);
        await db.customSections.add({ value: encryptedSection });
      }
    });
  } catch (error) {
    console.error('사용자 정의 섹션 저장 중 오류 발생:', error);
    throw error;
  }
};

export const loadCustomSections = async () => {
  try {
    const encryptedSections = await db.customSections.toArray();
    return encryptedSections.map(item => ({
      ...decryptData(item.value),
      id: item.id
    }));
  } catch (error) {
    console.error('사용자 정의 섹션 로딩 중 오류 발생:', error);
    throw error;
  }
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

export const deleteCustomSection = async (id) => {
  try {
    await db.customSections.delete(id);
  } catch (error) {
    console.error('Failed to delete custom section:', error);
    throw error;
  }
};