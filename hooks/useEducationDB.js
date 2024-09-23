import { useIndexedDB } from './useIndexedDB';

export const useEducationDB = () => {
  const { saveEducations, loadEducations } = useIndexedDB();

  const saveEducationsToDb = async (educations) => {
    try {
      await saveEducations(educations);
      console.log('학력 정보가 성공적으로 저장되었습니다');
    } catch (error) {
      console.error('학력 정보 저장 중 오류 발생:', error);
      throw error;
    }
  };

  const fetchEducations = async () => {
    try {
      const data = await loadEducations();
      console.log('불러온 학력 정보:', data);
      return data.length > 0 ? data : [];
    } catch (error) {
      console.error('학력 정보 불러오기 중 오류 발생:', error);
      throw error;
    }
  };

  return { saveEducationsToDb, fetchEducations };
};
