import { saveCareers, saveEducations, saveCustomSections, saveSectionOrder } from '@/utils/indexedDB';

export const resetAllStores = async (resetResumeStore) => {
  try {
    await resetResumeStore();

    await Promise.all([
      saveCareers([]),
      saveEducations([]),
      saveCustomSections([]),
      saveSectionOrder([]),
    ]);

    console.log('All stores reset successfully');
  } catch (error) {
    console.error('스토어 초기화 중 오류 발생:', error);
    throw error;
  }
};
