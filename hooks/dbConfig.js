// hooks/dbConfig.js
import Dexie from 'dexie';

let db;

export const initializeDB = async () => {
  if (db) return db;
  
  db = new Dexie('ResumeDB');
  db.version(1).stores({
    careers: '&id',
    educations: '&id',
    userInfo: '&id',
    profilePhotos: 'key',
    resumeData: 'key',
    customSections: '&id',
    profileData: 'key'
  });

  try {
    await db.open();
    return db;
  } catch (error) {
    console.error('데이터베이스 열기 실패:', error);
    throw error;
  }
};

export const getDB = async () => {
  if (!db) {
    return await initializeDB();
  }
  return db;
};