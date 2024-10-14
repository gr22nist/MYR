import { useCallback } from 'react';
import useResumeStore from '@/store/resumeStore';
import usecustomStore from '@/store/customStore';
import useUserInfoStore from '@/store/userInfoStore';
import useProfileStore from '@/store/profileStore';
import useGlobalStore from '@/store/globalStore';
import { resetAllStores } from '@/utils/resetStores';

export const useResumeActions = () => {
  const resetSections = useResumeStore(state => state.resetSections);
  const resetCustomSections = usecustomStore(state => state.resetCustomSections);
  const resetUserInfo = useUserInfoStore(state => state.resetUserInfo);
  const resetProfile = useProfileStore(state => state.resetProfile);
  const toggleAllSections = useResumeStore(state => state.toggleAllSections);
  const { showToast } = useGlobalStore();
  
  const handleReset = useCallback(async () => {
    try {
      await resetAllStores(resetSections, resetCustomSections, resetUserInfo, resetProfile);
      
      showToast({ message: '초기화 완료! 페이지가 새로고침 됩니다.', type: 'success' });
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
      showToast({ message: '초기화 중 오류 발생, 관리자에게 문의하세요.', type: 'error' });
    }
  }, [resetSections, resetCustomSections, resetUserInfo, resetProfile, showToast]);

  const handleToggleAllSections = useCallback(() => {
    toggleAllSections();
  }, [toggleAllSections]);

  return { handleReset, handleToggleAllSections };
};
