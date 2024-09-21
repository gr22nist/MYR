import { addItem, getItem } from '@/utils/indexedDB';

const STORE_NAME = 'userInfo';
const KEY = 'userInfoData';

export const saveuserInfoToDb = async (userInfo) => {
  try {
    const savedItem = await addItem(STORE_NAME, KEY, JSON.stringify(userInfo), true);
    console.log('Data saved to IndexedDB:', savedItem);
    return savedItem;
  } catch (error) {
    console.error('Error saving personal info:', error);
    throw error;
  }
};

export const loaduserInfoFromDb = async () => {
  try {
    const data = await getItem(STORE_NAME, KEY, true);
    console.log('Raw data loaded from IndexedDB:', data);
    if (data === null || data === undefined) {
      console.log('No data found in IndexedDB, returning empty array');
      return [];
    }
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('Parsed data:', parsedData);
      return Array.isArray(parsedData) ? parsedData : [parsedData];
    } catch (parseError) {
      console.error('Error parsing data:', parseError);
      return Array.isArray(data) ? data : [data];
    }
  } catch (error) {
    console.error('Error loading personal info:', error);
    return [];
  }
};