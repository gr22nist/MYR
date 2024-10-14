import { create } from 'zustand';
import { loadSectionOrder as loadSectionOrderFromDB, saveSectionOrder } from '@/utils/indexedDB';

const useSectionOrderStore = create((set, get) => ({
  sectionOrder: [],
  status: 'idle',
  error: null,

  loadSectionOrder: async () => {
    set({ status: 'loading' });
    try {
      const order = await loadSectionOrderFromDB();
      set({ 
        sectionOrder: Array.isArray(order) ? order : [],
        status: 'success',
        error: null
      });
    } catch (error) {
      console.error('섹션 순서 로딩 중 오류:', error);
      set({ 
        sectionOrder: [],
        status: 'error',
        error: '섹션 순서를 불러오는 데 실패했습니다.'
      });
    }
  },

  updateSectionOrder: async (newOrder) => {
    try {
      await saveSectionOrder(newOrder);
      set({ sectionOrder: newOrder, error: null });
    } catch (error) {
      console.error('섹션 순서 업데이트 중 오류:', error);
      set({ error: '섹션 순서를 저장하는 데 실패했습니다.' });
    }
  },

  addSectionToOrder: async (sectionId) => {
    const newOrder = [...get().sectionOrder, sectionId];
    try {
      await saveSectionOrder(newOrder);
      set({ sectionOrder: newOrder, error: null });
    } catch (error) {
      console.error('섹션 추가 중 오류:', error);
      set({ error: '새 섹션을 추가하는 데 실패했습니다.' });
    }
  },

  removeSectionFromOrder: async (sectionId) => {
    const newOrder = get().sectionOrder.filter(id => id !== sectionId);
    try {
      await saveSectionOrder(newOrder);
      set({ sectionOrder: newOrder, error: null });
    } catch (error) {
      console.error('섹션 제거 중 오류:', error);
      set({ error: '섹션을 제거하는 데 실패했습니다.' });
    }
  },
}));

export default useSectionOrderStore;
