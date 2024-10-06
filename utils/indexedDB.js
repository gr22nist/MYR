import { getDB } from '@/hooks/dbConfig';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const saveItems = async (storeName, items) => {
  const db = await getDB();
  await db.transaction('rw', storeName, async () => {
    await db.table(storeName).clear();
    if (Array.isArray(items) && items.length > 0) {
      const encryptedItems = items.map(item => ({
        id: item.id,
        value: encryptData({ ...item, id: item.id })
      }));
      await db.table(storeName).bulkAdd(encryptedItems);
    }
  });
};

const loadItems = async (storeName) => {
  const db = await getDB();
  if (!db[storeName]) return [];
  const encryptedItems = await db[storeName].toArray();
  return encryptedItems.map(item => {
    try {
      const decryptedData = decryptData(item.value);
      return { ...decryptedData, id: item.id };
    } catch (error) {
      console.error(`${storeName} 항목 복호화 중 오류:`, error);
      return null;
    }
  }).filter(Boolean);
};

const saveEncryptedItem = async (storeName, key, value) => {
  const db = await getDB();
  const data = storeName === 'sectionOrder' 
    ? { id: key, order: encryptData(value) }
    : { key, value: encryptData(value) };
  await db[storeName].put(data);
};

const loadEncryptedItem = async (storeName, key) => {
  const db = await getDB();
  if (!db[storeName]) return null;
  const data = await db[storeName].get(key);
  return data ? decryptData(storeName === 'sectionOrder' ? data.order : data.value) : null;
};

const deleteItem = async (storeName, id) => {
  const db = await getDB();
  await db[storeName].delete(id);
};

export const saveCareers = (careers) => careers?.length ? saveItems('careers', careers) : null;
export const loadCareers = () => loadItems('careers');

export const saveEducations = (educations) => educations?.length ? saveItems('educations', educations) : null;
export const loadEducations = () => loadItems('educations');

export const saveUserInfo = (userInfo) => {
  const itemsWithOrder = userInfo.map((item, index) => ({
    ...item,
    order: item.order !== undefined ? item.order : index
  }));
  return saveItems('userInfo', itemsWithOrder);
};

export const loadUserInfo = async () => {
  const items = await loadItems('userInfo');
  return items.sort((a, b) => a.order - b.order);
};

export const saveProfilePhoto = (photoData) => saveEncryptedItem('profilePhotos', 'profilePhoto', photoData);
export const loadProfilePhoto = () => loadEncryptedItem('profilePhotos', 'profilePhoto');

export const saveProfileData = (profileData) => saveEncryptedItem('profileData', 'profile', profileData);
export const loadProfileData = () => loadEncryptedItem('profileData', 'profile');

export const saveCustomSections = (sections) => saveItems('customSections', sections);
export const loadCustomSections = () => loadItems('customSections');

export const deleteCustomSection = (id) => deleteItem('customSections', id);

export const saveSectionOrder = (order) => saveEncryptedItem('sectionOrder', 'sectionOrder', order);
export const loadSectionOrder = () => loadEncryptedItem('sectionOrder', 'sectionOrder');

export const clearDatabase = async () => {
  const db = await getDB();
  const stores = ['careers', 'educations', 'customSections', 'userInfo', 'profilePhotos', 'profileData', 'sectionOrder'];
  
  await db.transaction('rw', stores, async () => {
    for (const store of stores) {
      if (db[store]) {
        await db[store].clear();
      }
    }
  });
};

export const clearsectionOrder = async () => {
  const db = await getDB();
  await db.transaction('rw', 'sectionOrder', async () => {
    await db.sectionOrder.clear();
  });
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

export const checksectionOrderStore = async () => {
  const db = await getDB();
  if (db.sectionOrder) {
    const count = await db.sectionOrder.count();
    const allData = await db.sectionOrder.toArray();
  }
};

export const manualClearsectionOrder = async () => {
  const db = await getDB();
  await db.sectionOrder.clear();
};

export const deleteProfilePhoto = async () => {
  const db = await getDB();
  try {
    await db.profilePhotos.delete('profilePhoto');
    return true;
  } catch (error) {
    console.error('프로필 사진 삭제 중 오류 발생:', error);
    return false;
  }
};