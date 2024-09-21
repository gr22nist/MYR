import { useIndexedDB } from './useIndexedDB';

export const useEducationDB = () => {
  const indexedDB = useIndexedDB();
  const { saveEducations, loadEducations } = indexedDB;

  const saveEducationsToDb = async (educations) => {
    try {
      await saveEducations(educations);
      console.log('Educations saved successfully');
    } catch (error) {
      console.error('Error saving educations:', error);
      throw error;
    }
  };

  const fetchEducations = async () => {
    try {
      const data = await loadEducations();
      if (data && data.length > 0) {
        console.log('Loaded educations:', data);
        return data;
      }
      console.log('No educations found in IndexedDB');
      return [];
    } catch (error) {
      console.error('Error loading educations:', error);
      throw error;
    }
  };

  return { saveEducationsToDb, fetchEducations };
};
