import { useCallback } from 'react';
import useResumeStore from '@/store/resumeStore';
import { clearDatabase } from '@/utils/indexedDB';

export const useResumeActions = () => {
  const resetStore = useResumeStore(state => state.resetStore);
  
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

  const handlePreview = useCallback(() => {
    // 미리보기 로직
  }, []);

  return { handleReset, handlePreview };
};
