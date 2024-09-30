import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';  // uuid 라이브러리에서 v4 함수를 import
import { saveCustomSections, loadCustomSections as loadCustomSectionsDB, deleteCustomSection, loadSectionOrder, saveSectionOrder } from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import { resetAllStores } from '@/utils/resetStores';
import useResumeStore from './resumeStore';

const initialState = {
  customSections: [],
  sectionOrder: [],
  predefinedSections: {},
};

const useCustomSectionsStore = create((set, get) => ({
  ...initialState,

  loadCustomSections: async () => {
    const { isLoading } = get();
    if (isLoading) return; // 이미 로딩 중이면 함수 실행을 중단

    set({ isLoading: true });
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

      set({ 
        customSections: savedSections, 
        sectionOrder: savedOrder || [],
        predefinedSections,
        isLoading: false
      });
    } catch (error) {
      console.error('커스텀 섹션 로딩 중 오류:', error);
      set({ isLoading: false });
    }
  },

  addCustomSection: (type) => {
    const { customSections, predefinedSections } = get();
    const updateSectionOrder = useResumeStore.getState().updateSectionOrder;
    const sectionOrder = useResumeStore.getState().sectionOrder;
    const newSection = {
      id: uuidv4(),
      type,
      title: type === CUSTOM_SECTIONS.type ? '' : PREDEFINED_SECTIONS[type] || '새 섹션',
      content: '',
      links: type === 'link' ? [] : undefined,
    };

    const updatedSections = [...customSections, newSection];
    const updatedOrder = [...sectionOrder, newSection.id];
    const updatedPredefinedSections = { ...predefinedSections };
    if (type !== CUSTOM_SECTIONS.type) {
      updatedPredefinedSections[type] = true;
    }

    set({ 
      customSections: updatedSections,
      sectionOrder: updatedOrder,
      predefinedSections: updatedPredefinedSections
    });

    saveCustomSections(updatedSections);
    updateSectionOrder(updatedOrder);

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
    set(state => {
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
    const resetCustomSectionsStore = () => set(initialState);
    const resetResumeStore = () => {
    };

    resetAllStores(resetResumeStore, resetCustomSectionsStore);
  },
}));

export default useCustomSectionsStore;