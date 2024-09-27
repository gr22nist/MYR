import { create } from 'zustand';
import { getEncryptedItem, addEncryptedItem, getImage, addImage } from '@/utils/indexedDB';

const useProfileStore = create((set, get) => ({
  profile: {
    title: '',
    paragraph: '',
    imageUrl: null,
  },
  isLoading: true,
  error: null,

  loadProfile: async () => {
    set({ isLoading: true });
    try {
      const storedTitle = await getEncryptedItem('profileTexts', 'profileTitle');
      const storedParagraph = await getEncryptedItem('profileTexts', 'profileParagraph');
      const storedImage = await getImage('profilePhoto');
      
      set({
        profile: {
          title: storedTitle || '',
          paragraph: storedParagraph || '',
          imageUrl: storedImage || null,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: (field, value) => {
    set((state) => ({
      profile: { ...state.profile, [field]: value }
    }));
    addEncryptedItem('profileTexts', `profile${field.charAt(0).toUpperCase() + field.slice(1)}`, value);
  },

  updateProfileImage: async (imageData) => {
    set((state) => ({
      profile: { ...state.profile, imageUrl: imageData }
    }));
    if (imageData) {
      try {
        await addImage('profilePhoto', imageData);
      } catch (error) {
        console.error('이미지 저장 실패:', error);
      }
    }
  },

  resetProfile: () => set({ profile: { title: '', paragraph: '', imageUrl: null } }),
}));

export default useProfileStore;
