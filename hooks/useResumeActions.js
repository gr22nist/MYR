import { useCallback } from 'react';
import useUserInfoStore from '@/store/userInfoStore';
import useCareerStore from '@/store/careerStore';
import useEducationStore from '@/store/educationStore';
import useProfileStore from '@/store/profileStore';
import useCustomSectionStore from '@/store/customStore';
import { clearDatabase } from '@/utils/indexedDB';

export const useResumeActions = () => {
  const { resetUserInfo } = useUserInfoStore();
  const { resetCareers } = useCareerStore();
  const { resetEducations } = useEducationStore();
  const { resetProfile } = useProfileStore();
  const { resetCustomSections } = useCustomSectionStore();

  const handleReset = useCallback(async () => {
    try {
      await clearDatabase();
      await resetUserInfo();
      await resetCareers();
      await resetEducations();
      await resetProfile();
      await resetCustomSections();
      return true;
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
      return false;
    }
  }, [resetUserInfo, resetCareers, resetEducations, resetProfile, resetCustomSections]);

  const handlePreview = useCallback(() => {
    window.open('/preview', '_blank');
  }, []);

  return { handleReset, handlePreview };
};
