import { create } from 'zustand';
import { loadProfileData, loadProfilePhoto, saveProfileData, saveProfilePhoto, deleteProfilePhoto } from '@/utils/indexedDB';
import { getDB } from '@/hooks/dbConfig';

const useProfileStore = create((set, get) => ({
  profile: {
    title: '',
    paragraph: '',
    imageUrl: null,
  },
  isLoading: true,
  error: null,

  loadProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      await getDB();
      
      const profileData = await loadProfileData();
      const profilePhoto = await loadProfilePhoto();
      
      console.log('프로필 데이터 로드:', profileData);
      console.log('프로필 사진 로드:', profilePhoto ? '존재함' : '없음');
      console.log('프로필 사진 데이터:', profilePhoto ? profilePhoto.substring(0, 50) + '...' : 'null');

      set({ 
        profile: {
          ...profileData,
          imageUrl: profilePhoto
        } || { title: '', paragraph: '', imageUrl: null },
        isLoading: false,
      });
    } catch (error) {
      console.error('프로필 로딩 중 오류:', error);
      set({ 
        error: error.message || '프로필 로딩 중 알 수 없는 오류가 발생했습니다.', 
        isLoading: false,
        profile: { title: '', paragraph: '', imageUrl: null },
      });
    }
  },

  updateProfile: async (field, value) => {
    set((state) => {
      const newProfile = { ...state.profile, [field]: value };
      const isProfileEmpty = Object.values(newProfile).every(v => v === '' || v === null);
      saveProfileData(isProfileEmpty ? null : newProfile).catch(error => {
        set({ error: error.message });
      });
      return { profile: newProfile };
    });
  },

  updateProfileImage: async (imageData) => {
    set((state) => ({
      profile: { ...state.profile, imageUrl: imageData }
    }));
    if (imageData) {
      try {
        await saveProfilePhoto(imageData);
      } catch (error) {
        set({ error: error.message });
      }
    }
  },

  resetProfile: async () => {
    try {
      await Promise.all([
        saveProfileData(null),  // null을 저장하여 완전히 삭제
        deleteProfilePhoto()
      ]);
      set({ profile: { title: '', paragraph: '', imageUrl: null }, error: null });
      return true;
    } catch (error) {
      console.error('프로필 리셋 중 오류:', error);
      set({ error: error.message });
      throw error;
    }
  },

  exportProfile: async () => {
    const [profileData, profilePhoto] = await Promise.all([
      loadProfileData(),
      loadProfilePhoto()
    ]);
    return { profileData, profilePhoto };
  },
}));

export default useProfileStore;
