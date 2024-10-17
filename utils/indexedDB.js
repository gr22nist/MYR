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

export const saveEducations = (educations) => saveData('educations', educations.map(edu => ({
  ...edu,
  graduationStatus: edu.graduationStatus || ''
})));
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

export const saveProfilePhoto = async (photoData) => {
  return saveData('profilePhotos', photoData);
};

export const loadProfilePhoto = async () => {
  const photoData = await loadData('profilePhotos');
  return photoData;
};

export const saveProfileData = (profileData) => {
  return saveData('profileData', profileData);
};

export const loadProfileData = async () => {
  return await loadData('profileData');
};

export const saveCustomSections = async (sections) => {
  return saveData('customSections', sections.map(section => ({
    ...section,
    showQR: section.showQR || false
  })));
};

export const loadCustomSections = async () => {
  const sections = await loadData('customSections');
  return sections ? sections.map(section => ({
    ...section,
    showQR: section.showQR || false
  })) : [];
};

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
    await db.profilePhotos.clear();
    return true;
  } catch (error) {
    console.error('프로필 사진 삭제 중 오류 발생:', error);
    return false;
  }
};

// 전체 데이터 내보내기
export const exportAllData = async () => {
  try {
    const db = await getDB();
    const profilePhoto = await loadProfilePhoto();
    
    const encryptedData = {
      userInfo: await db.userInfo.toArray(),
      careers: await db.careers.toArray(),
      educations: await db.educations.toArray(),
      customSections: {
        customSections: await db.customSections.toArray(),
        sectionOrder: await db.sectionOrder.get('sectionOrder')
      },
      profile: {
        profileData: await db.profileData.get('profileData'),
        profilePhoto: profilePhoto ? { key: 'profilePhoto', value: profilePhoto } : null
      }
    };

    // null이나 빈 배열인 경우 해당 키를 제거
    Object.keys(encryptedData).forEach(key => {
      if (encryptedData[key] === null || (Array.isArray(encryptedData[key]) && encryptedData[key].length === 0)) {
        delete encryptedData[key];
      }
    });

    // profile 객체 내부의 null 값 제거
    if (encryptedData.profile) {
      Object.keys(encryptedData.profile).forEach(key => {
        if (encryptedData.profile[key] === null) {
          delete encryptedData.profile[key];
        }
      });
      // profile 객체가 비어있으면 제거
      if (Object.keys(encryptedData.profile).length === 0) {
        delete encryptedData.profile;
      }
    }

    return encryptedData;
  } catch (error) {
    console.error('전체 데이터 내보내기 오류:', error);
    return null;
  }
};

// 데이터 가져오기
export const importData = async (encryptedData) => {
  try {
    const db = await getDB();
    await db.transaction('rw', 
      ['userInfo', 'careers', 'educations', 'customSections', 'profileData', 'sectionOrder', 'profilePhotos'], 
      async () => {
        // userInfo, careers, educations 처리
        for (const store of ['userInfo', 'careers', 'educations']) {
          await db[store].clear();
          if (Array.isArray(encryptedData[store])) {
            for (const item of encryptedData[store]) {
              await db[store].add(item);
            }
          }
        }

        // customSections 처리
        if (encryptedData.customSections) {
          await db.customSections.clear();
          if (Array.isArray(encryptedData.customSections.customSections)) {
            for (const item of encryptedData.customSections.customSections) {
              await db.customSections.add(item);
            }
          }
          if (encryptedData.customSections.sectionOrder) {
            await db.sectionOrder.put(encryptedData.customSections.sectionOrder);
          }
        }

        // profile 처리
        if (encryptedData.profile) {
          if (encryptedData.profile.profileData) {
            await db.profileData.put(encryptedData.profile.profileData);
          }
          if (encryptedData.profile.profilePhoto) {
            await saveProfilePhoto(encryptedData.profile.profilePhoto.value);
          }
        }
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
