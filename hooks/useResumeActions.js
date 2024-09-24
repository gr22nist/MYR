import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { resetResume } from '@/redux/slices/resumeSlice';
import { resetCareers } from '@/redux/slices/careerSlice';
import { resetEducations } from '@/redux/slices/educationSlice';
import { resetCustomSections } from '@/redux/slices/customSectionSlice';
import { resetUserInfo } from '@/redux/slices/userInfoSlice';
import { showToast } from '@/redux/slices/globalSlice';
import { clearDatabase } from '@/utils/indexedDB';

export const useResumeActions = () => {
  const dispatch = useDispatch();

  const handleReset = useCallback(async () => {
    try {
      // 데이터베이스 초기화
      await clearDatabase();
      
      // Redux 상태 초기화
      dispatch(resetResume());
      dispatch(resetCareers());
      dispatch(resetEducations());
      dispatch(resetCustomSections());
      dispatch(resetUserInfo());
      
      dispatch(showToast({ message: '서식이 초기화되었습니다.', type: 'success' }));
    } catch (error) {
      console.error('서식 초기화 중 오류 발생:', error);
      dispatch(showToast({ message: '서식 초기화에 실패했습니다.', type: 'error' }));
    }
  }, [dispatch]);

  const handlePreview = useCallback(() => {
    window.open('/resume/preview', '_blank');
  }, []);

  return { handleReset, handlePreview };
};
