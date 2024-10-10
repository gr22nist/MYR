// utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// 데이터 암호화 함수
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    // console.log('Encrypted data:', encrypted);
    return encrypted;
  } catch (error) {
    console.error('암호화 오류:', error);
    return null;
  }
};

// 데이터 복호화 함수
export const decryptData = (encryptedData) => {
  if (!encryptedData) {
    // console.log('암호화된 데이터가 없습니다.');
    return null;
  }

  try {
    // console.log('Attempting to decrypt:', encryptedData);
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      // console.log('복호화 결과가 비어있습니다');
      return null;
    }

    // console.log('Decrypted string:', decryptedString);

    try {
      const parsed = JSON.parse(decryptedString);
      // console.log('Parsed result:', parsed);
      return parsed;
    } catch (parseError) {
      // console.log('JSON 파싱 오류, 원본 문자열 반환:', decryptedString);
      return decryptedString;
    }
  } catch (error) {
    console.error('복호화 오류:', error);
    return null;
  }
};
