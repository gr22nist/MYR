import { create } from 'zustand';
import { loadCustomSections as loadCustomSectionsDB, saveCustomSections, deleteCustomSection } from '@/utils/indexedDB';

const useCustomStore = create((set, get) => ({
  customSections: [],
  sectionOrder: ['career', 'education', 'customForm'], // 기본 섹션 순서

  loadCustomSections: async () => {
    try {
      const savedSections = await loadCustomSectionsDB();
      set({ customSections: savedSections || [] });
    } catch (error) {
      console.error('커스텀 섹션 로드 실패:', error);
    }
  },

  addCustomSection: (newSection) => {
    set((state) => {
      const updatedSections = [...state.customSections, newSection];
      saveCustomSections(updatedSections);
      return { 
        customSections: updatedSections,
        sectionOrder: [...state.sectionOrder, newSection.id]
      };
    });
  },

  updateCustomSection: (updatedSection) => {
    set((state) => {
      const updatedSections = state.customSections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      );
      saveCustomSections(updatedSections);
      return { customSections: updatedSections };
    });
  },

  removeCustomSection: async (id) => {
    set((state) => {
      const updatedSections = state.customSections.filter(section => section.id !== id);
      deleteCustomSection(id);
      return { 
        customSections: updatedSections,
        sectionOrder: state.sectionOrder.filter(sectionId => sectionId !== id)
      };
    });
  },

  resetCustomSections: () => {
    set({ 
      customSections: [],
      sectionOrder: ['career', 'education', 'customForm']
    });
    saveCustomSections([]);
  },

  updateSectionOrder: (newOrder) => {
    set({ sectionOrder: newOrder });
    // 여기에 새로운 순서를 저장하는 로직을 추가할 수 있습니다.
    // 예: saveSectionOrder(newOrder);
  },

  getSections: () => {
    const { customSections, sectionOrder } = get();
    return sectionOrder.map(id => {
      if (id === 'career' || id === 'education' || id === 'customForm') {
        return { id };
      }
      return customSections.find(section => section.id === id);
    });
  },
}));

export default useCustomStore;
