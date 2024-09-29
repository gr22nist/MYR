import { create } from 'zustand';
import { loadProfileData, saveProfileData, loadProfilePhoto, saveProfilePhoto } from '@/utils/indexedDB';
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
      // 데이터베이스 초기화 확인
      await getDB();
      
      const storedProfile = await loadProfileData();
      const storedImage = await loadProfilePhoto();
      
      set({
        profile: {
          title: storedProfile?.title || '',
          paragraph: storedProfile?.paragraph || '',
          imageUrl: storedImage || null,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('프로필 로딩 에러:', error);
      set({ 
        error: error.message || '프로필 로딩 중 알 수 없는 오류가 발생했습니다.', 
        isLoading: false,
        profile: { title: '', paragraph: '', imageUrl: null } // 기본값 설정
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
      console.log('프로필 업데이트:', newProfile);
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
        console.log('프로필 이미지 저장 성공');
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
      console.log('프로필 리셋 완료');
    } catch (error) {
      console.error('프로필 리셋 실패:', error);
      set({ error: error.message });
    }
  },
}));

export default useProfileStore;