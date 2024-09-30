import { getDB } from '@/hooks/dbConfig';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const saveItems = async (storeName, items) => {
  const db = await getDB();
  try {
    await db.transaction('rw', storeName, async () => {
      await db.table(storeName).clear();
      if (Array.isArray(items) && items.length > 0) {
        const encryptedItems = items.map(item => ({
          id: item.id,
          value: encryptData({ ...item, id: undefined })
        }));
        await db.table(storeName).bulkAdd(encryptedItems);
      } else {
        console.warn(`No items to save for ${storeName}`);
      }
    });
  } catch (error) {
    console.error(`Transaction failed for ${storeName}:`, error);
    throw error;
  }
};

const loadItems = async (storeName) => {
  const db = await getDB();
  try {
    if (!db[storeName]) {
      console.error(`Store ${storeName} does not exist in the database`);
      return [];
    }
    const encryptedItems = await db[storeName].toArray();
    const decryptedItems = encryptedItems.map(item => {
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
    return decryptedItems;
  } catch (error) {
    console.error(`Error loading ${storeName}:`, error);
    return []; // 오류 발생 시 빈 배열 반환
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
  const db = await getDB();
  try {
    await db[storeName].delete(id);
  } catch (error) {
    console.error(`Error deleting item from ${storeName}:`, error);
    throw error;
  }
};

export const saveCareers = async (careers) => {
  if (!careers || careers.length === 0) return;
  try {
    await saveItems('careers', careers);
    console.log(`Successfully saved ${careers.length} items for careers`);
  } catch (error) {
    console.error('Error saving careers:', error);
    throw error;
  }
};

export const loadCareers = () => loadItems('careers');
export const saveEducations = async (educations) => {
  if (!educations || educations.length === 0) return;
  try {
    await saveItems('educations', educations);
    console.log(`Successfully saved ${educations.length} items for educations`);
  } catch (error) {
    console.error('Error saving educations:', error);
    throw error;
  }
};
export const loadEducations = async () => {
  const educations = await loadItems('educations');
  return educations;
};

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

export const saveCustomSections = async (sections) => {
  try {
    console.log('Saving custom sections:', sections);
    await saveItems('customSections', sections);
    console.log('Custom sections saved successfully');
  } catch (error) {
    console.error('Error saving custom sections:', error);
    throw error;
  }
};

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
  const db = await getDB();
  try {
    await db.transaction('rw', ['careers', 'educations', 'customSections', 'userInfo', 'profile', 'sectionOrder'], async () => {
      await db.careers.clear();
      await db.educations.clear();
      await db.customSections.clear();
      await db.userInfo.clear();
      await db.profile.clear();
      await db.sectionOrder.clear();
    });
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

export const loadSections = async () => {
  try {
    const [careers, educations, customSections] = await Promise.all([
      loadCareers(),
      loadEducations(),
      loadCustomSections()
    ]);

    const sections = [
      { id: 'career', type: 'career', title: '경력', items: careers || [] },
      { id: 'education', type: 'education', title: '학력', items: educations || [] },
      ...customSections.map(section => ({
        id: section.type,
        type: section.type,
        title: getSectionTitle(section.type),
        items: section.items || []
      }))
    ];

    console.log('Loaded sections:', sections);
    return sections;
  } catch (error) {
    console.error('Error loading all sections:', error);
    return [
      { id: 'career', type: 'career', title: '경력', items: [] },
      { id: 'education', type: 'education', title: '학력', items: [] }
    ];
  }
};

// 섹션 타입에 따른 제목을 반환하는 함수
const getSectionTitle = (type) => {
  const titles = {
    project: '프로젝트',
    award: '수상 경력',
    certificate: '자격증',
    language: '외국어',
    skill: '보유 기술',
    link: '링크',
    custom: ''
  };
  return titles[type] || '기타';
};

export const deleteSection = (id) => deleteItem('sections', id);