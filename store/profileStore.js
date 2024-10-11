import { create } from 'zustand';
import { encryptData, decryptData } from '@/utils/cryptoUtils';
import { saveProfileData, loadProfileData, saveProfilePhoto, loadProfilePhoto } from '@/utils/indexedDB';

const useProfileStore = create((set) => ({
  profile: { title: '', paragraph: '', imageUrl: null },
  isLoading: false,
  error: null,

  loadProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const [encryptedProfileData, profilePhoto] = await Promise.all([
        loadProfileData(),
        loadProfilePhoto()
      ]);
      
      const decryptedProfile = encryptedProfileData ? decryptData(encryptedProfileData) : { title: '', paragraph: '' };
      set({ 
        profile: { ...decryptedProfile, imageUrl: profilePhoto },
        isLoading: false 
      });
    } catch (error) {
      console.error('프로필 로딩 실패:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (field, value) => {
    set((state) => {
      const newProfile = {
        ...state.profile,
        [field]: value
      };
      saveProfileData(encryptData(newProfile)); // 비동기 함수이지만 여기서는 await를 사용하지 않습니다.
      return { profile: newProfile };
    });
  },

  updateProfileImage: async (newImageUrl) => {
    try {
      await saveProfilePhoto(newImageUrl);
      set((state) => ({
        profile: { ...state.profile, imageUrl: newImageUrl }
      }));
    } catch (error) {
      console.error('프로필 이미지 업데이트 실패:', error);
      set({ error: error.message });
    }
  },

  resetProfile: async () => {
    const resetProfile = { title: '', paragraph: '', imageUrl: null };
    try {
      await saveProfileData(resetProfile);
      set({ profile: resetProfile, error: null });
    } catch (error) {
      console.error('프로필 리셋 실패:', error);
      set({ error: error.message });
    }
  },

  exportProfile: async () => {
    const [profileData, profilePhoto] = await Promise.all([
      loadEncryptedProfileData(),
      loadEncryptedProfilePhoto()
    ]);
    return { profileData, profilePhoto };
  },
}));

export default useProfileStore;