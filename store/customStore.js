import { create } from 'zustand';
import { generateUUID } from '@/utils/uuid';
import { 
  saveCustomSections, 
  loadCustomSections as loadCustomSectionsDB, 
  deleteSection, 
  loadSectionOrder as loadSectionOrderFromDB, 
  saveSectionOrder
} from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import { resetAllStores } from '@/utils/resetStores';
import useResumeStore from './resumeStore';

const initialState = {
  customSections: [],
  sectionOrder: [],
  predefinedSections: {},
  isLoading: false,
  error: null,
};

const usecustomStore = create((set, get) => ({
  ...initialState,

  loadCustomSections: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const [savedSections, savedOrder] = await Promise.all([
        loadCustomSectionsDB(),
        loadSectionOrderFromDB()
      ]);

      const order = Array.isArray(savedOrder) ? savedOrder : [];
      const sections = Array.isArray(savedSections) ? savedSections : [];

      const predefinedSections = sections.reduce((acc, section) => {
        if (section.type !== CUSTOM_SECTIONS.type) {
          acc[section.type] = true;
        }
        return acc;
      }, {});

      set({ 
        customSections: sections, 
        sectionOrder: order,
        predefinedSections,
        isLoading: false
      });
    } catch (error) {
      console.error('커스텀 섹션 로딩 중 오류:', error);
      set({ isLoading: false, error: error.message });
    }
  },

  addCustomSection: (type) => {
    const { customSections, predefinedSections, sectionOrder } = get();
    const newSection = {
      id: generateUUID(),
      type,
      title: type === CUSTOM_SECTIONS.type ? '' : PREDEFINED_SECTIONS[type] || '새 섹션',
      content: '',
      links: type === 'link' ? [] : undefined,
    };

    const updatedSections = [...customSections, newSection];
    const updatedOrder = Array.isArray(sectionOrder) 
      ? [...sectionOrder, newSection.id] 
      : ['career', 'education', newSection.id];

    const updatedPredefinedSections = { ...predefinedSections };
    if (type !== CUSTOM_SECTIONS.type) {
      updatedPredefinedSections[type] = true;
    }

    set({ 
      customSections: updatedSections,
      sectionOrder: updatedOrder,
      predefinedSections: updatedPredefinedSections
    });

    saveCustomSections(updatedSections).catch((error) => {
      console.error('커스텀 섹션 저장 중 오류 발생:', error);
      set({ error: error.message });
    });

    saveSectionOrder(updatedOrder).catch((error) => {
      console.error('섹션 순서 저장 중 오류 발생:', error);
      set({ error: error.message });
    });

    return newSection;
  },

  updateSectionOrder: (newOrder) => {
    set({ sectionOrder: newOrder });
    saveSectionOrder(newOrder).catch(error => {
      console.error('섹션 순서 저장 중 오류:', error);
      set({ error: error.message });
    });
  },

  updateCustomSection: (id, updatedSection) => {
    set(state => {
      const updatedSections = state.customSections.map(section =>
        section.id === id ? { ...section, ...updatedSection } : section
      );
      saveCustomSections(updatedSections).catch(error => {
        console.error('커스텀 섹션 업데이트 중 오류:', error);
        set({ error: error.message });
      });
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
      
      const updatedOrder = state.sectionOrder.filter(sectionId => sectionId !== id);
      
      deleteSection(id).then(success => {
        if (!success) {
          console.error('섹션 삭제 실패');
          set({ error: '섹션 삭제 실패' });
        }
      }).catch(error => {
        console.error('섹션 삭제 중 오류 발생:', error);
        set({ error: error.message });
      });

      return { 
        customSections: updatedSections,
        sectionOrder: updatedOrder,
        predefinedSections: updatedPredefinedSections
      };
    });
  },

  resetCustomSections: () => {
    set(initialState);
    saveCustomSections([]);
    saveSectionOrder(['career', 'education']);
  },

  loadSectionOrder: async () => {
    try {
      const order = await loadSectionOrderFromDB();
      set({ sectionOrder: order });
      return order;
    } catch (error) {
      console.error('섹션 순서 로딩 중 오류:', error);
      set({ error: error.message });
      return [];
    }
  },
}));

export default usecustomStore;
