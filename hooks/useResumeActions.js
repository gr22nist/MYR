import { useCallback } from 'react';
import useResumeStore from '@/store/resumeStore';
import { clearDatabase } from '@/utils/indexedDB';

export const useResumeActions = () => {
  const resetStore = useResumeStore(state => state.resetStore);
  const toggleAllSections = useResumeStore(state => state.toggleAllSections);
  
  const handleReset = useCallback(async () => {
    try {
      await clearDatabase();
      resetStore();
      console.log('Database and store reset successfully');
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
      throw error;
    }
  }, [resetStore]);

  // const handlePreview = useCallback(() => {
  //   console.log('Preview functionality is currently disabled');
  //   // 미리보기 로직
  // }, []);

  const handleToggleAllSections = useCallback(() => {
    toggleAllSections();
  }, [toggleAllSections]);

  return { handleReset, handleToggleAllSections };
};
