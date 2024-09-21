import Dexie from 'dexie';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const db = new Dexie('ResumeDB');

const initializeDB = async () => {
  try {
    console.log('Initializing database...');
    db.version(13).stores({  // 버전을 13으로 올립니다.
      careers: '++id',
      educations: '++id',
      userInfo: 'key',  // 'key'를 primary key로 사용합니다.
      profilePhotos: 'key',
      profileTexts: 'key',
      resumeData: 'key'
    });
    console.log('Database schema defined.');
    await db.open();
    console.log('Database opened successfully.');
    console.log('Available stores:', db.tables.map(table => table.name));
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

initializeDB();

export const saveCareers = async (careers) => {
  await db.careers.clear();
  await db.careers.bulkAdd(careers);
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
      console.log('Database is not open. Attempting to open...');
      await db.open();
    }
    if (!db[storeName]) {
      throw new Error(`Object store "${storeName}" not found.`);
    }
    const value = encrypt ? encryptData(data) : data;
    await db[storeName].put({ key, value });
    console.log(`Item added to ${storeName}:`, { key, value });
    
    // 저장 후 즉시 데이터를 다시 로드하여 확인
    const savedItem = await db[storeName].get(key);
    console.log(`Saved item retrieved from ${storeName}:`, savedItem);
    
    return savedItem ? savedItem.value : null;
  } catch (error) {
    console.error(`Error in addItem (${storeName}, ${key}):`, error);
    throw error;
  }
};

export const getItem = async (storeName, key, decrypt = true) => {
  try {
    if (!db.isOpen()) {
      console.log('Database is not open. Attempting to open...');
      await db.open();
    }
    if (!db[storeName]) {
      throw new Error(`Object store "${storeName}" not found.`);
    }
    const item = await db[storeName].get(key);
    console.log(`Raw item retrieved from ${storeName}:`, item);
    if (item && item.value) {
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
  } catch (error) {
    console.error(`Error in getItem (${storeName}, ${key}):`, error);
    throw error;
  }
};

export const deleteItem = async (storeName, key) => {
  try {
    await db[storeName].delete(key);
    console.log('Item deleted from the store', key);
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