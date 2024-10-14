import { 
  saveCareers, 
  saveEducations, 
  saveCustomSections, 
  saveSectionOrder,
  saveUserInfo,
  saveProfileData,
  deleteProfilePhoto,
  clearDatabase
} from '@/utils/indexedDB';

export const resetAllStores = async (resetResumeStore, resetCustomStore, resetUserInfoStore, resetProfileStore) => {
  try {
    // 데이터베이스 완전 초기화
    await clearDatabase();

    // 모든 스토어 리셋
    if (typeof resetResumeStore === 'function') await resetResumeStore();
    if (typeof resetCustomStore === 'function') await resetCustomStore();
    if (typeof resetUserInfoStore === 'function') await resetUserInfoStore();
    if (typeof resetProfileStore === 'function') await resetProfileStore();

    // 기본 데이터 설정
    await Promise.all([
      saveSectionOrder(['career', 'education']),
      saveProfileData({ title: '', paragraph: '', imageUrl: null }),
    ]);

    console.log('모든 스토어와 데이터베이스가 성공적으로 초기화되었습니다.');
    return true;
  } catch (error) {
    console.error('스토어 초기화 중 오류 발생:', error);
    throw error;
  }
};
