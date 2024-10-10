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
  const db = await getDB();
  if (!db.userInfo) return [];
  const encryptedItems = await db.userInfo.toArray();
  const decryptedItems = encryptedItems.map(item => {
    try {
      const decryptedData = decryptData(item.value);
      if (!decryptedData) {
        console.warn(`Failed to decrypt item: ${item.id}`);
        return null;
      }
      return {
        ...decryptedData,
        id: item.id,
        type: decryptedData.type || 'text',
        displayType: decryptedData.displayType || decryptedData.type || 'text'
      };
    } catch (error) {
      console.error(`Error decrypting item ${item.id}:`, error);
      return null;
    }
  }).filter(Boolean);

  return decryptedItems.sort((a, b) => a.order - b.order);
};

export const saveProfilePhoto = (photoData) => saveEncryptedItem('profilePhotos', 'profilePhoto', photoData);
export const loadProfilePhoto = () => loadEncryptedItem('profilePhotos', 'profilePhoto');

export const saveProfileData = (profileData) => saveEncryptedItem('profileData', 'profile', profileData);
export const loadProfileData = () => loadEncryptedItem('profileData', 'profile');

export const saveCustomSections = (sections) => saveItems('customSections', sections);
export const loadCustomSections = () => loadItems('customSections');

export const deleteCustomSection = (id) => deleteItem('customSections', id);

export const saveSectionOrder = async (order) => {
  const db = await getDB();
  if (order.length === 0) {
    await db.sectionOrder.where('id').equals('sectionOrder').delete();
    // console.log('빈 sectionOrder 삭제 완료');
  } else {
    const encryptedOrder = encryptData(order);
    await db.sectionOrder.put({ id: 'sectionOrder', order: encryptedOrder });
    // console.log('sectionOrder 저장 완료:', order);
  }
};

export const loadSectionOrder = async () => {
  const db = await getDB();
  const encryptedOrder = await db.sectionOrder.get('sectionOrder');
  // console.log('로드된 암호화된 sectionOrder:', encryptedOrder);
  
  if (encryptedOrder && encryptedOrder.order) {
    const decryptedOrder = decryptData(encryptedOrder.order);
    // console.log('복호화된 sectionOrder:', decryptedOrder);
    return decryptedOrder;
  }
  
  // console.log('sectionOrder가 없거나 빈 배열임');
  return [];
};

export const clearDatabase = async () => {
  // console.log('clearDatabase 시작');
  const db = await getDB();
  const stores = ['careers', 'educations', 'customSections', 'userInfo', 'profilePhotos', 'profileData', 'sectionOrder'];
  
  await db.transaction('rw', stores, async () => {
    for (const store of stores) {
      if (db[store]) {
        await db[store].clear();
        // console.log(`${store} 스토어 초기화 완료`);
      }
    }
  });

  try {
    await db.sectionOrder.where('id').equals('sectionOrder').delete();
    // console.log('sectionOrder 완전히 삭제 완료');
  } catch (error) {
    console.error('sectionOrder 삭제 중 오류:', error);
  }
  
  // console.log('clearDatabase 완료');
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

export const loadEncryptedItems = async (storeName) => {
  const db = await getDB();
  if (!db[storeName]) return [];
  const encryptedItems = await db[storeName].toArray();
  return encryptedItems.map(item => ({
    id: item.id,
    value: item.value // 암호화된 상태 그대로 반환
  }));
};

export const loadEncryptedProfileData = async () => {
  try {
    const db = await getDB();
    const result = await db.profileData.get('profile');
    // console.log('Loaded encrypted profile data:', result);
    return result;
  } catch (error) {
    console.error('Error loading encrypted profile data:', error);
    return null;
  }
};

export const loadEncryptedProfilePhoto = async () => {
  try {
    const db = await getDB();
    const result = await db.profilePhotos.get('profilePhoto');
    // console.log('Loaded encrypted profile photo:', result);
    return result;
  } catch (error) {
    console.error('Error loading encrypted profile photo:', error);
    return null;
  }
};

export const loadEncryptedSectionOrder = async () => {
  try {
    const db = await getDB();
    const data = await db.sectionOrder.get('sectionOrder');
    return data ? { key: 'sectionOrder', value: data.order } : null;
  } catch (error) {
    console.error('Error loading encrypted section order:', error);
    return null;
  }
};

export const loadEncryptedUserInfo = async () => {
  try {
    const db = await getDB();
    const encryptedItems = await db.userInfo.toArray();
    return encryptedItems.map(item => ({
      id: item.id,
      value: item.value // 암호화된 상태 그대로 반환
    }));
  } catch (error) {
    console.error('Error loading encrypted user info:', error);
    return [];
  }
};

export const loadEncryptedCustomSections = async () => {
  try {
    const db = await getDB();
    const encryptedItems = await db.customSections.toArray();
    return encryptedItems.map(item => ({
      id: item.id,
      value: item.value // 암호화된 상태 그대로 반환
    }));
  } catch (error) {
    console.error('Error loading encrypted custom sections:', error);
    return [];
  }
};

export const loadEncryptedCareers = async () => {
  try {
    const db = await getDB();
    const encryptedItems = await db.careers.toArray();
    return encryptedItems.map(item => ({
      id: item.id,
      value: item.value // 암호화된 상태 그대로 반환
    }));
  } catch (error) {
    console.error('Error loading encrypted careers:', error);
    return [];
  }
};

export const loadEncryptedEducations = async () => {
  try {
    const db = await getDB();
    const encryptedItems = await db.educations.toArray();
    return encryptedItems.map(item => ({
      id: item.id,
      value: item.value // 암호화된 상태 그대로 반환
    }));
  } catch (error) {
    console.error('Error loading encrypted educations:', error);
    return [];
  }
};