// utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

const getSecretKey = () => {
  if (typeof window === 'undefined') {
    // 서버 사이드
    return process.env.SECRET_KEY;
  } else {
    // 클라이언트 사이드
    return process.env.NEXT_PUBLIC_SECRET_KEY;
  }
};

// 데이터 암호화 함수
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, getSecretKey()).toString();
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

  const SECRET_KEY = getSecretKey();

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
