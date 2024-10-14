import { create } from 'zustand';
import { loadSectionOrder as loadSectionOrderFromDB, saveSectionOrder } from '@/utils/indexedDB';

const useSectionOrderStore = create((set, get) => ({
  sectionOrder: ['career', 'education'],  // 기본값 설정
  status: 'idle',
  error: null,

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
    const newOrder = sectionOrder.filter(id => id !== sectionId);
    await get().updateSectionOrder(newOrder);
  },
}));

export default useSectionOrderStore;
