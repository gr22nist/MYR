import { saveCareers, saveEducations, saveCustomSections, saveSectionOrder } from '@/utils/indexedDB';

export const resetAllStores = async (resetResumeStore, resetCustomSectionsStore) => {
  try {
    resetResumeStore();
    resetCustomSectionsStore();

    await Promise.all([
      saveCareers([]),
      saveEducations([]),
      saveCustomSections([]),
    ]);

  } catch (error) {
    console.error('스토어 초기화 중 오류 발생:', error);
    throw error;
  }
};
