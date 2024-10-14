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

      set({ 
        profile: {
          ...profileData,
          imageUrl: profilePhoto
        } || { title: '', paragraph: '', imageUrl: null },
        isLoading: false,
      });
    } catch (error) {
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
      saveProfileData(newProfile).catch(error => {
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
    const resetProfile = { title: '', paragraph: '', imageUrl: null };
    try {
      await saveProfileData(resetProfile);
      await deleteProfilePhoto();
      set({ profile: resetProfile, error: null });
    } catch (error) {
      console.error('프로필 리셋 중 오류:', error);
      set({ error: error.message });
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
