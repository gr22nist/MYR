import { useCallback } from 'react';
import useResumeStore from '@/store/resumeStore';
import usecustomStore from '@/store/customStore';
import useUserInfoStore from '@/store/userInfoStore';
import useProfileStore from '@/store/profileStore';
import useGlobalStore from '@/store/globalStore';
import { resetAllStores } from '@/utils/resetStores';
import useSectionOrderStore from '@/store/sectionOrderStore';

export const useResumeActions = () => {
  const resetSections = useResumeStore(state => state.resetSections);
  const loadAllSections = useResumeStore(state => state.loadAllSections);
  const resetCustomSections = usecustomStore(state => state.resetCustomSections);
  const resetUserInfo = useUserInfoStore(state => state.resetUserInfo);
  const resetProfile = useProfileStore(state => state.resetProfile);
  const loadProfile = useProfileStore(state => state.loadProfile);
  const toggleAllSections = useResumeStore(state => state.toggleAllSections);
  const { showToast } = useGlobalStore();
  const resetSectionOrder = useSectionOrderStore(state => state.resetSectionOrder);
  const loadSectionOrder = useSectionOrderStore(state => state.loadSectionOrder);
  
  const handleReset = useCallback(async () => {
    try {
      await resetAllStores(
        resetSections, 
        resetCustomSections, 
        resetUserInfo, 
        resetProfile,
        resetSectionOrder
      );
      
      // 초기화 후 데이터 다시 로드
      await Promise.all([
        loadAllSections(),
        loadProfile(),
        loadSectionOrder()
      ]);
      
      showToast({ message: '초기화 완료! 페이지가 새로고침 됩니다.', type: 'success' });
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
      showToast({ message: '초기화 중 오류 발생, 관리자에게 문의하세요.', type: 'error' });
    }
  }, [resetSections, resetCustomSections, resetUserInfo, resetProfile, resetSectionOrder, loadAllSections, loadProfile, loadSectionOrder, showToast]);

  const handleToggleAllSections = useCallback(() => {
    toggleAllSections();
  }, [toggleAllSections]);

  return { handleReset, handleToggleAllSections };
};
