import { useCallback } from 'react';
import useResumeStore from '@/store/resumeStore';
import useCustomSectionsStore from '@/store/customStore';
import useGlobalStore from '@/store/globalStore';
import { clearDatabase, clearsectionOrder, checksectionOrderStore, manualClearsectionOrder } from '@/utils/indexedDB';

export const useResumeActions = () => {
  const resetSections = useResumeStore(state => state.resetSections);
  const resetCustomSections = useCustomSectionsStore(state => state.resetCustomSections);
  const toggleAllSections = useResumeStore(state => state.toggleAllSections);
  const { showToast } = useGlobalStore();
  
  const handleReset = useCallback(async () => {
    try {
      await clearDatabase();
      await Promise.all([resetSections(), resetCustomSections()]);
      
      showToast({ message: '초기화 완료! 페이지가 새로고침 됩니다.', type: 'success' });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
      showToast({ message: '초기화 오류, 페이지가 새로고침 됩니다.', type: 'error' });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [resetSections, resetCustomSections, showToast]);

  const handleToggleAllSections = useCallback(() => {
    toggleAllSections();
  }, [toggleAllSections]);

  return { handleReset, handleToggleAllSections };
};
