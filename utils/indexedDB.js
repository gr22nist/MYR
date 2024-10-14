import { getDB } from '@/hooks/dbConfig';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

// 통합된 저장 함수
const saveData = async (storeName, data) => {
  try {
    const db = await getDB();
    await db.transaction('rw', storeName, async () => {
      await db.table(storeName).clear();
      if (data === null) {
        // 데이터가 null이면 저장하지 않고 종료
        return;
      }
      if (Array.isArray(data)) {
        const encryptedItems = data.map(item => ({
          id: item.id,
          value: encryptData({ ...item, id: item.id })
        }));
        await db.table(storeName).bulkAdd(encryptedItems);
      } else if (storeName === 'sectionOrder') {
        await db.table(storeName).put({ id: 'sectionOrder', order: encryptData(data) });
      } else {
        const encryptedData = { key: storeName, value: encryptData(data) };
        await db.table(storeName).put(encryptedData);
      }
    });
    return true;
  } catch (error) {
    console.error(`${storeName} 저장 중 오류:`, error);
    return false;
  }
};

// 통합된 로드 함수
const loadData = async (storeName) => {
  try {
    const db = await getDB();
    if (!db[storeName]) return null;
    const encryptedData = await db[storeName].toArray();
    if (encryptedData.length === 0) return null;

    if (storeName === 'sectionOrder') {
      return decryptData(encryptedData[0].order);
    } else if (encryptedData.length === 1 && encryptedData[0].key === storeName) {
      return decryptData(encryptedData[0].value);
    } else {
      return encryptedData.map(item => {
        try {
          const decryptedData = decryptData(item.value);
          return { ...decryptedData, id: item.id };
        } catch (error) {
          console.error(`${storeName} 항목 복호화 중 오류:`, error);
          return null;
        }
      }).filter(Boolean);
    }
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const saveCareers = (careers) => saveData('careers', careers);
export const loadCareers = () => loadData('careers');

export const saveEducations = (educations) => saveData('educations', educations);
export const loadEducations = () => loadData('educations');

export const saveUserInfo = (userInfo) => {
  const itemsWithOrder = userInfo.map((item, index) => ({
    ...item,
    order: item.order !== undefined ? item.order : index
  }));
  return saveData('userInfo', itemsWithOrder);
};

export const loadUserInfo = async () => {
  const items = await loadData('userInfo');
  return items ? items.sort((a, b) => a.order - b.order) : [];
};

export const saveProfilePhoto = (photoData) => saveData('profilePhotos', photoData);
export const loadProfilePhoto = async () => {
  const photoData = await loadData('profilePhotos');
  return photoData ? photoData : null;
};

export const saveProfileData = (profileData) => {
  return saveData('profileData', profileData);
};

export const loadProfileData = async () => {
  return await loadData('profileData');
};

export const saveCustomSections = (sections) => saveData('customSections', sections);
export const loadCustomSections = () => loadData('customSections');

export const saveSectionOrder = async (order) => {
  try {
    const db = await getDB();
    await db.transaction('rw', 'sectionOrder', async () => {
      await db.table('sectionOrder').clear();
      await db.table('sectionOrder').put({ id: 'sectionOrder', order: encryptData(order) });
    });
    return true;
  } catch (error) {
    console.error('섹션 순서 저장 중 오류:', error);
    return false;
  }
};

export const loadSectionOrder = async () => {
  try {
    const db = await getDB();
    const result = await db.table('sectionOrder').get('sectionOrder');
    if (result && result.order) {
      return decryptData(result.order);
    }
    return [];
  } catch (error) {
    console.error('섹션 순서 로딩 중 오류:', error);
    return [];
  }
};

export const clearDatabase = async () => {
  const db = await getDB();
  const stores = ['careers', 'educations', 'customSections', 'userInfo', 'profilePhotos', 'profileData', 'sectionOrder'];
  
  await db.transaction('rw', stores, async () => {
    for (const store of stores) {
      await db[store].clear();
    }
  });

  // 초기화 확인
  for (const store of stores) {
    const count = await db[store].count();
    if (count > 0) {
      throw new Error(`${store} 스토어가 완전히 비워지지 않았습니다.`);
    }
  }

  return true;
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
      ...(customSections || []).map(section => ({
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

export const deleteSection = async (id) => {
  try {
    const db = await getDB();
    // customSections에서 해당 섹션 삭제
    const customSections = await loadCustomSections();
    if (!customSections) return false;
    
    const updatedSections = customSections.filter(section => section.id !== id);
    await saveCustomSections(updatedSections);

    // sectionOrder에서 해당 id 제거
    const sectionOrder = await loadSectionOrder();
    if (!sectionOrder) return false;
    
    const updatedOrder = sectionOrder.filter(sectionId => sectionId !== id && sectionId !== 'career' && sectionId !== 'education');
    updatedOrder.unshift('career', 'education');
    await saveSectionOrder(updatedOrder);

    return true;
  } catch (error) {
    console.error('섹션 삭제 중 오류 발생:', error);
    return false;
  }
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

// 전체 데이터 내보내기
export const exportAllData = async () => {
  try {
    const allData = {
      userInfo: await loadUserInfo(),
      careers: await loadCareers(),
      educations: await loadEducations(),
      customSections: await loadCustomSections(),
      profileData: await loadProfileData(),
      sectionOrder: await loadSectionOrder()
    };
    return encryptData(allData);
  } catch (error) {
    console.error('전체 데이터 내보내기 오류:', error);
    return null;
  }
};

// 데이터 가져오기
export const importData = async (encryptedData) => {
  try {
    const decryptedData = decryptData(encryptedData);
    if (!decryptedData) {
      throw new Error('데이터 복호화 실패');
    }

    const db = await getDB();
    await db.transaction('rw', 
      ['userInfo', 'careers', 'educations', 'customSections', 'profileData', 'sectionOrder'], 
      async () => {
        if (decryptedData.userInfo) await saveUserInfo(decryptedData.userInfo);
        if (decryptedData.careers) await saveCareers(decryptedData.careers);
        if (decryptedData.educations) await saveEducations(decryptedData.educations);
        if (decryptedData.customSections) await saveCustomSections(decryptedData.customSections);
        if (decryptedData.profileData) await saveProfileData(decryptedData.profileData);
        if (decryptedData.sectionOrder) await saveSectionOrder(decryptedData.sectionOrder);
      }
    );

    return true;
  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
    return false;
  }
};

// profileData와 sectionOrder를 위한 명시적 초기화 함수 추가
export const initializeProfileData = () => saveData('profileData', null);
export const initializeSectionOrder = async () => {
  try {
    await saveSectionOrder(['career', 'education']);
    return true;
  } catch (error) {
    console.error('섹션 순서 초기화 중 오류:', error);
    return false;
  }
};
