import { useIndexedDB } from './useIndexedDB';

export const useCareerDB = () => {
  const { saveCareers, loadCareers } = useIndexedDB();

  const saveCareersToDb = async (careers) => {
    try {
      await saveCareers(careers);
      console.log('Careers saved successfully');
    } catch (error) {
      console.error('Error saving careers:', error);
      throw error;
    }
  };

  const fetchCareers = async () => {
    try {
      const data = await loadCareers();
      console.log('Loaded careers:', data);
      return data.length > 0 ? data : [];
    } catch (error) {
      console.error('Error loading careers:', error);
      throw error;
    }
  };

  return { saveCareersToDb, fetchCareers };
};
