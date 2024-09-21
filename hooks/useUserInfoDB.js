import { addItem, getItem } from '@/utils/indexedDB';

const STORE_NAME = 'userInfo';
const KEY = 'userInfoData';

export const saveuserInfoToDb = async (userInfo) => {
  try {
    const savedItem = await addItem(STORE_NAME, KEY, JSON.stringify(userInfo), true);
    return savedItem;
  } catch (error) {
    throw error;
  }
};

export const loaduserInfoFromDb = async () => {
  try {
    const data = await getItem(STORE_NAME, KEY, true);
    if (data === null || data === undefined) {
      return [];
    }
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      return Array.isArray(parsedData) ? parsedData : [parsedData];
    } catch (parseError) {
      return Array.isArray(data) ? data : [data];
    }
  } catch (error) {
    return [];
  }
};