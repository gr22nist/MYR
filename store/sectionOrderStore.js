import { create } from 'zustand';
import { loadSectionOrder as loadSectionOrderFromDB, saveSectionOrder } from '@/utils/indexedDB';

const initialState = {
  sectionOrder: ['career', 'education'],
  status: 'idle',
  error: null,
};

const useSectionOrderStore = create((set, get) => ({
  ...initialState,
  loadSectionOrder: async () => {
    set({ status: 'loading' });
    try {
      const order = await loadSectionOrderFromDB();
      const newOrder = Array.isArray(order) && order.length > 0 
        ? order 
        : ['career', 'education'];
      
      // 'career'와 'education'이 없다면 추가
      if (!newOrder.includes('career')) newOrder.unshift('career');
      if (!newOrder.includes('education')) newOrder.splice(1, 0, 'education');

      set({ 
        sectionOrder: newOrder,
        status: 'success',
        error: null
      });
    } catch (error) {
      console.error('섹션 순서 로딩 중 오류:', error);
      set({ 
        sectionOrder: ['career', 'education'],
        status: 'error',
        error: '섹션 순서를 불러오는 데 실패했습니다.'
      });
    }
  },

  updateSectionOrder: async (newOrder) => {
    // 'career'와 'education'이 없다면 추가
    if (!newOrder.includes('career')) newOrder.unshift('career');
    if (!newOrder.includes('education')) newOrder.splice(1, 0, 'education');

    try {
      await saveSectionOrder(newOrder);
      set({ sectionOrder: newOrder, error: null });
    } catch (error) {
      console.error('섹션 순서 업데이트 중 오류:', error);
      set({ error: '섹션 순서를 저장하는 데 실패했습니다.' });
    }
  },

  addSectionToOrder: async (sectionId) => {
    const { sectionOrder } = get();
    const newOrder = [...sectionOrder, sectionId];
    await get().updateSectionOrder(newOrder);
  },

  removeSectionFromOrder: async (sectionId) => {
    const { sectionOrder } = get();
    if (sectionId !== 'career' && sectionId !== 'education') {
      const newOrder = sectionOrder.filter(id => id !== sectionId);
      await get().updateSectionOrder(newOrder);
    }
  },

  resetSectionOrder: async () => {
    const defaultOrder = ['career', 'education'];
    try {
      await saveSectionOrder(defaultOrder);
      set({ sectionOrder: defaultOrder, status: 'success', error: null });
      return true;
    } catch (error) {
      console.error('섹션 순서 리셋 중 오류:', error);
      set({ error: '섹션 순서를 리셋하는 데 실패했습니다.', status: 'error' });
      return false;
    }
  },
}));

export default useSectionOrderStore;
