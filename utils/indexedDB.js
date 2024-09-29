import { getDB } from '@/hooks/dbConfig';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const saveItems = async (storeName, items) => {
  const db = await getDB();
  try {
    await db.transaction('rw', db[storeName], async () => {
      await db[storeName].clear();
      const encryptedItems = items.map(item => ({
        id: item.id,
        value: encryptData({ ...item, id: undefined }) // id를 암호화된 데이터에서 제외
      }));
      await db[storeName].bulkAdd(encryptedItems);
    });
  } catch (error) {
    console.error(`Error saving ${storeName}:`, error);
    throw error;
  }
};

const loadItems = async (storeName) => {
  const db = await getDB();
  try {
    const encryptedItems = await db[storeName].toArray();
    return encryptedItems.map(item => {
      try {
        const decryptedData = decryptData(item.value);
        return {
          ...decryptedData,
          id: item.id
        };
      } catch (decryptError) {
        console.error(`Error decrypting item from ${storeName}:`, decryptError);
        return null;
      }
    }).filter(Boolean);
  } catch (error) {
    console.error(`Error loading ${storeName}:`, error);
    throw error;
  }
};

const saveEncryptedItem = async (storeName, key, value) => {
  const db = await getDB();
  await db[storeName].put({ key, value: encryptData(value) });
};

const loadEncryptedItem = async (storeName, key) => {
  const db = await getDB();
  try {
    if (!db[storeName]) {
      console.error(`Store ${storeName} does not exist`);
      return null;
    }
    const data = await db[storeName].get(key);
    return data ? decryptData(data.value) : null;
  } catch (error) {
    console.error(`Error loading from ${storeName}:`, error);
    return null;
  }
};

const deleteItem = async (storeName, id) => {
  try {
    await db[storeName].delete(id);
  } catch (error) {
    console.error(`Error deleting item from ${storeName}:`, error);
    throw error;
  }
};

export const saveCareers = (careers) => saveItems('careers', careers);
export const loadCareers = () => loadItems('careers');
export const saveEducations = (educations) => saveItems('educations', educations);
export const loadEducations = () => loadItems('educations');

export const saveUserInfo = (userInfo) => saveItems('userInfo', userInfo);
export const loadUserInfo = async () => {
  try {
    const items = await loadItems('userInfo');
    return items;
  } catch (error) {
    console.error('Error loading user info from IndexedDB:', error);
    return [];
  }
};

export const saveProfilePhoto = async (photoData) => {
  const db = await getDB();
  await db.profilePhotos.put({ key: 'profilePhoto', value: photoData });
};

export const loadProfilePhoto = async () => {
  const db = await getDB();
  try {
    const photoData = await db.profilePhotos.get('profilePhoto');
    return photoData ? photoData.value : null;
  } catch (error) {
    console.error('프로필 사진 로드 중 오류 발생:', error);
    return null;
  }
};

export const saveProfileData = async (profileData) => {
  try {
    await saveEncryptedItem('profileData', 'profile', profileData);
    console.log('프로필 데이터 저장 성공:', profileData);
  } catch (error) {
    console.error('프로필 데이터 저장 실패:', error);
    throw error;
  }
};

export const loadProfileData = async () => {
  try {
    const data = await loadEncryptedItem('profileData', 'profile');
    return data;
  } catch (error) {
    console.error('프로필 데이터 로드 실패:', error);
    return null;
  }
};

export const saveCustomSections = (sections) => saveItems('customSections', sections);
export const loadCustomSections = async () => {
  try {
    const sections = await loadItems('customSections');
    console.log('Loaded custom sections:', sections);
    return sections;
  } catch (error) {
    console.error('Error loading custom sections:', error);
    return [];
  }
};

export const deleteCustomSection = (id) => deleteItem('customSections', id);

export const saveSectionOrder = (order) => saveEncryptedItem('resumeData', 'sectionOrder', order);
export const loadSectionOrder = () => loadEncryptedItem('resumeData', 'sectionOrder');

export const clearDatabase = async () => {
  try {
    if (!db.isOpen()) {
      await db.open();
    }
    const stores = ['careers', 'educations', 'userInfo', 'profilePhotos', 'profileData', 'resumeData', 'customSections'];
    await Promise.all(stores.map(async (storeName) => {
      if (db[storeName]) {
        await db[storeName].clear();
      }
    }));
    console.log('모든 스토어가 성공적으로 초기화되었습니다');
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류 발생:', error);
    throw error;
  }
};