// utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

// 데이터 암호화 함수
export const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(data, process.env.NEXT_PUBLIC_SECRET_KEY).toString();
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
};

// 데이터 복호화 함수
export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.NEXT_PUBLIC_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};
