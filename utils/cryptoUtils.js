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
    console.error('암호화 오류:', error);
    return null;
  }
};

// 데이터 복호화 함수
export const decryptData = (encryptedData) => {
  if (!encryptedData) {
    return null;
  }

  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      return null;
    }

    try {
      const parsed = JSON.parse(decryptedString);
      return parsed;
    } catch (parseError) {
      return decryptedString;
    }
  } catch (error) {
    console.error('복호화 오류:', error);
    return null;
  }
};
