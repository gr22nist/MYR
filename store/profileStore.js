import { create } from 'zustand';
import { loadProfileData, loadProfilePhoto, saveProfileData, saveProfilePhoto, deleteProfilePhoto } from '@/utils/indexedDB';
import { getDB } from '@/hooks/dbConfig';

const useProfileStore = create((set, get) => ({
  profile: {
    title: '',
    paragraph: '',
    imageUrl: null,
    paragraphHeight: 'auto',
  },
  isLoading: true,
  error: null,

  loadProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      await getDB();
      
      const profileData = await loadProfileData();
      const profilePhoto = await loadProfilePhoto();

      set({ 
        profile: {
          ...profileData,
          imageUrl: profilePhoto,
          paragraphHeight: profileData?.paragraphHeight || 'auto',
        } || { title: '', paragraph: '', imageUrl: null, paragraphHeight: 'auto' },
        isLoading: false,
      });
    } catch (error) {
      console.error('프로필 로딩 중 오류:', error);
      set({ 
        error: error.message || '프로필 로딩 중 알 수 없는 오류가 발생했습니다.', 
        isLoading: false,
        profile: { title: '', paragraph: '', imageUrl: null, paragraphHeight: 'auto' },
      });
    }
  },

  updateProfile: async (field, value) => {
    set((state) => {
      const newProfile = { ...state.profile, [field]: value };
      const isProfileEmpty = Object.values(newProfile).every(v => v === '' || v === null || v === 'auto');
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
    try {
      if (imageData) {
        await saveProfilePhoto(imageData);
      } else {
        await deleteProfilePhoto();
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  resetProfile: async () => {
    try {
      await Promise.all([
        saveProfileData(null),  // null을 저장하여 완전히 삭제
        deleteProfilePhoto()
      ]);
      set({ profile: { title: '', paragraph: '', imageUrl: null, paragraphHeight: 'auto' }, error: null });
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
