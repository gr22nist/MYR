import { create } from 'zustand';
import { generateUUID } from '@/utils/uuid';
import { 
  saveCustomSections, 
  loadCustomSections as loadCustomSectionsDB, 
  deleteSection
} from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import useSectionOrderStore from './sectionOrderStore';

const initialState = {
  customSections: [],
  predefinedSections: {},
  isLoading: false,
  error: null,
};

const useCustomStore = create((set, get) => ({
  ...initialState,

  loadCustomSections: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const savedSections = await loadCustomSectionsDB();

      const sections = Array.isArray(savedSections) ? savedSections : [];

      const predefinedSections = sections.reduce((acc, section) => {
        if (section.type !== CUSTOM_SECTIONS.type) {
          acc[section.type] = true;
        }
        return acc;
      }, {});

      set({ 
        customSections: sections, 
        predefinedSections,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('커스텀 섹션 로딩 중 오류:', error);
      set({ isLoading: false, error: error.message });
    }
  },

  addCustomSection: (type) => {
    const { customSections, predefinedSections } = get();
    const newSection = {
      id: generateUUID(),
      type,
      title: type === CUSTOM_SECTIONS.type ? '' : PREDEFINED_SECTIONS[type] || '새 섹션',
      content: '',
      links: type === 'link' ? [] : undefined,
    };

    const updatedSections = [...customSections, newSection];

    const updatedPredefinedSections = { ...predefinedSections };
    if (type !== CUSTOM_SECTIONS.type) {
      updatedPredefinedSections[type] = true;
    }

    set({ 
      customSections: updatedSections,
      predefinedSections: updatedPredefinedSections,
      error: null
    });

    saveCustomSections(updatedSections).catch((error) => {
      console.error('커스텀 섹션 저장 중 오류 발생:', error);
      set({ error: error.message });
    });

    useSectionOrderStore.getState().addSectionToOrder(newSection.id);

    return newSection;
  },

  updateCustomSection: (id, updatedSection) => {
    set(state => {
      const updatedSections = state.customSections.map(section =>
        section.id === id ? { ...section, ...updatedSection } : section
      );
      console.log('Updated sections:', updatedSections); // 디버깅을 위한 로그
      saveCustomSections(updatedSections).catch(error => {
        console.error('커스텀 섹션 업데이트 중 오류:', error);
        set({ error: error.message });
      });
      return { customSections: updatedSections, error: null };
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
      
      deleteSection(id).catch(error => {
        console.error('섹션 삭제 중 오류 발생:', error);
        set({ error: error.message });
      });

      useSectionOrderStore.getState().removeSectionFromOrder(id);

      return { 
        customSections: updatedSections,
        predefinedSections: updatedPredefinedSections,
        error: null
      };
    });
  },

  resetCustomSections: async () => {
    try {
      await saveCustomSections([]);
      set({
        customSections: [],
        predefinedSections: {},
        isLoading: false,
        error: null,
      });
      useSectionOrderStore.getState().updateSectionOrder(['career', 'education']);
      return true;
    } catch (error) {
      console.error('커스텀 섹션 리셋 중 오류:', error);
      set({ error: error.message });
      return false;
    }
  },
}));

export default useCustomStore;
