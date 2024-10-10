import { create } from 'zustand';
import { loadEncryptedProfileData, loadEncryptedProfilePhoto, saveProfileData, saveProfilePhoto } from '@/utils/indexedDB';
import { getDB } from '@/hooks/dbConfig';
import { decryptData } from '@/utils/cryptoUtils';

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
      
      const profileData = await loadEncryptedProfileData();
      const profilePhoto = await loadEncryptedProfilePhoto();

      const decryptedProfile = profileData ? decryptData(profileData.value) : null;
      const decryptedPhoto = profilePhoto ? decryptData(profilePhoto.value) : null;

      if (!decryptedProfile) {
        set({ 
          profile: { title: '', paragraph: '' },
          profilePhoto: null,
          isLoading: false,
        });
        return;
      }

      set({ 
        profile: decryptedProfile, 
        profilePhoto: decryptedPhoto,
        isLoading: false,
      });
    } catch (error) {
      console.error('프로필 로딩 에러:', error);
      set({ 
        error: error.message || '프로필 로딩 중 알 수 없는 오류가 발생했습니다.', 
        isLoading: false,
        profile: { title: '', paragraph: '' },
        profilePhoto: null
      });
    }
  },

  updateProfile: async (field, value) => {
    set((state) => {
      const newProfile = { ...state.profile, [field]: value };
      saveProfileData(newProfile).catch(error => {
        console.error('프로필 데이터 저장 실패:', error);
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
        console.error('이미지 저장 실패:', error);
        set({ error: error.message });
      }
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