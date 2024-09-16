// hooks/dbConfig.js
import Dexie from 'dexie';

export const initializeDB = () => {
  const db = new Dexie('MYRDB');
  db.version(1).stores({
    profilePhotos: '++id,profilePhoto',
    profileTexts: '++id,profileTitle,profileParagraph',
    resumeData: '++id,data',
  });
  return db;
};
