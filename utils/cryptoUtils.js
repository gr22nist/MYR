// utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// 데이터 암호화 함수
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
};

// 데이터 복호화 함수
export const decryptData = (encryptedData) => {
  try {
    if (typeof encryptedData !== 'string') {
      return encryptedData;
    }
    if (encryptedData.startsWith('data:image')) {
      return encryptedData;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedData) {
      return null;
    }
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};
