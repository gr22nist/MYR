import { useCallback } from 'react';
import { useIndexedDB } from './useIndexedDB';

export const useCareerDB = () => {
  const { getEncryptedItem, addEncryptedItem } = useIndexedDB();

  const fetchCareers = useCallback(async () => {
    try {
      const careers = await getEncryptedItem('resumeData', 'careers');
      return careers || [];
    } catch (error) {
      console.error('Failed to fetch careers:', error);
      return [];
    }
  }, [getEncryptedItem]);

  const saveCareersToDb = useCallback(async (careers) => {
    try {
      await addEncryptedItem('resumeData', 'careers', careers);
    } catch (error) {
      console.error('Failed to save careers:', error);
    }
  }, [addEncryptedItem]);

  return { fetchCareers, saveCareersToDb };
};
