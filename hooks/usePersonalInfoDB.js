import { savePersonalInfo, loadPersonalInfo } from '../utils/indexedDB';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

export const personalInfoDB = {
  fetchPersonalInfo: async () => {
    try {
      const personalInfo = await loadPersonalInfo();
      return personalInfo || { items: [], isExpanded: false };
    } catch (error) {
      console.error('Failed to fetch personal info:', error);
      return { items: [], isExpanded: false };
    }
  },

  savePersonalInfoToDb: async (personalInfo) => {
    try {
      await savePersonalInfo(personalInfo);
      // 암호화된 버전도 저장
      const encryptedValue = encryptData(personalInfo);
      await savePersonalInfo({ key: 'personalInfo', value: encryptedValue });
    } catch (error) {
      console.error('Failed to save personal info:', error);
    }
  }
};
