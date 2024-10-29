let db;
let initializationPromise = null;
let DexieModule = null;

export const initializeDB = async () => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    if (db && db.isOpen()) {
      return db;
    }

    try {
      if (!DexieModule) {
        DexieModule = await import('dexie').then(mod => mod.default);
      }

      db = new DexieModule('ResumeDB');
      db.version(1).stores({
        profileData: 'key',
        profilePhotos: 'key',
        userInfo: '&id',
        careers: '&id',
        educations: '&id',
        customSections: '&id',
        sectionOrder: '&id, order',
      });

      await db.open();
      return db;
    } catch (error) {
      console.error('데이터베이스 초기화 실패:', error);
      db = null;
      throw error;
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
};

export const getDB = async (retries = 3) => {
  try {
    if (!db || !db.isOpen()) {
      await initializeDB();
    }
    return db;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getDB(retries - 1);
    }
    throw error;
  }
};