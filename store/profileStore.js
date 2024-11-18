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
    try {
      const profileData = await loadProfileData();
      if (profileData) {
        set({ 
          profile: {
            ...profileData,
            imageUrl: await loadProfilePhoto() || null
          },
          isLoading: false 
        });
      } else {
        set({ 
          profile: { title: '', paragraph: '', imageUrl: null },
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('프로필 로딩 중 오류:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (field, value) => {
    set((state) => {
      const newProfile = { 
        ...state.profile, 
        [field]: value,
      };
      
      console.log('updateProfile - newProfile:', newProfile);
      
      const { imageUrl, ...profileDataToSave } = newProfile;
      const isProfileEmpty = !profileDataToSave.title && !profileDataToSave.paragraph;
      
      console.log('Saving to IndexedDB:', profileDataToSave);

      saveProfileData(isProfileEmpty ? null : profileDataToSave).catch(error => {
        console.error('프로필 저장 중 오류:', error);
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
