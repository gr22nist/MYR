import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';  // uuid 라이브러리에서 v4 함수를 import
import { loadCustomSections as loadCustomSectionsDB, saveCustomSections, deleteCustomSection, saveSectionOrder, loadSectionOrder } from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';

const useCustomSectionsStore = create((set, get) => ({
  customSections: [],
  sectionOrder: [],
  predefinedSections: {},

  loadCustomSections: async () => {
    try {
      const [savedSections, savedOrder] = await Promise.all([
        loadCustomSectionsDB(),
        loadSectionOrder()
      ]);
      
      const predefinedSections = savedSections.reduce((acc, section) => {
        if (section.type !== CUSTOM_SECTIONS.type) {
          acc[section.type] = true;
        }
        return acc;
      }, {});
      
      const fullOrder = savedOrder || ['career', 'education', ...savedSections.map(s => s.id)];
      
      set({ 
        customSections: savedSections || [], 
        predefinedSections,
        sectionOrder: fullOrder
      });
    } catch (error) {
      console.error('커스텀 섹션 로드 실패:', error);
    }
  },

  addCustomSection: (type) => {
    const { customSections, predefinedSections, sectionOrder } = get();

    if (type !== CUSTOM_SECTIONS.type && (customSections.some(section => section.type === type) || predefinedSections[type])) {
      console.warn('Section already exists. Skipping addition.');
      return null;
    }

    const newSection = {
      id: uuidv4(),
      type,
      title: type === CUSTOM_SECTIONS.type ? '새 자유 서식' : PREDEFINED_SECTIONS[type] || '새 섹션',
      content: '',
      links: type === 'link' ? [] : undefined,
    };

    const updatedSections = [...customSections, newSection];
    const updatedOrder = [...sectionOrder, newSection.id];
    const updatedPredefinedSections = { ...predefinedSections, [type]: true };

    saveCustomSections(updatedSections);
    saveSectionOrder(updatedOrder);

    set({ 
      customSections: updatedSections,
      sectionOrder: updatedOrder,
      predefinedSections: updatedPredefinedSections
    });

    return newSection;
  },

  updateSectionOrder: (newOrder) => {
    set({ sectionOrder: newOrder });
    saveSectionOrder(newOrder);
  },

  updateCustomSection: (id, updatedSection) => {
    set(state => {
      const updatedSections = state.customSections.map(section =>
        section.id === id ? { ...section, ...updatedSection } : section
      );
      saveCustomSections(updatedSections);
      return { customSections: updatedSections };
    });
  },

  removeCustomSection: (id) => {
    set((state) => {
      const sectionToRemove = state.customSections.find(section => section.id === id);
      const updatedSections = state.customSections.filter(section => section.id !== id);
      const updatedPredefinedSections = { ...state.predefinedSections };
      if (sectionToRemove && sectionToRemove.type !== CUSTOM_SECTIONS.type) {
        delete updatedPredefinedSections[sectionToRemove.type];
      }
      
      Promise.all([
        deleteCustomSection(id),
        saveCustomSections(updatedSections),
        saveSectionOrder(state.sectionOrder.filter(sectionId => sectionId !== id))
      ]).catch(error => console.error('섹션 삭제 중 오류 발생:', error));

      return { 
        customSections: updatedSections,
        sectionOrder: state.sectionOrder.filter(sectionId => sectionId !== id),
        predefinedSections: updatedPredefinedSections
      };
    });
  },

  resetCustomSections: () => {
    set({ 
      customSections: [],
      sectionOrder: ['career', 'education'],
      predefinedSections: {}
    });
    Promise.all([
      saveCustomSections([]),
      saveSectionOrder(['career', 'education'])
    ]).catch(error => console.error('섹션 초기화 중 오류 발생:', error));
  },
}));

export default useCustomSectionsStore;