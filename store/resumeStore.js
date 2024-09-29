import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { 
  loadCustomSections, 
  saveCustomSections, 
  deleteCustomSection, 
  saveSectionOrder, 
  loadSectionOrder,
  loadCareers,
  loadEducations
} from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import { createBaseActions } from '@/utils/storeUtils';

const useResumeStore = create((set, get) => ({
  sections: [],
  sectionOrder: [],
  predefinedSections: {
    career: false,
    education: false,
    project: false,
    award: false,
    certificate: false,
    language: false,
    skill: false,
    link: false
  },
  ...createBaseActions('sections', loadCustomSections, saveCustomSections),

  setSections: (sections) => set({ sections }),
  setSectionOrder: (order) => set({ sectionOrder: order }),

  loadSections: async () => {
    try {
      const [savedSections, savedOrder] = await Promise.all([
        loadCustomSections(),
        loadSectionOrder()
      ]);
      
      const predefinedSections = savedSections.reduce((acc, section) => {
        if (section.type !== CUSTOM_SECTIONS.type) {
          acc[section.type] = true;
        }
        return acc;
      }, {});
      
      set({ 
        sections: savedSections || [],
        sectionOrder: savedOrder || [],
        predefinedSections
      });
    } catch (error) {
      console.error('섹션 로드 실패:', error);
    }
  },

  addSection: (type) => {
    const { sections, sectionOrder, predefinedSections } = get();

    if (type !== CUSTOM_SECTIONS.type && (sections.some(section => section.type === type) || predefinedSections[type])) {
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

    const updatedSections = [...sections, newSection];
    const updatedOrder = [...sectionOrder, newSection.id];
    const updatedPredefinedSections = { ...predefinedSections, [type]: true };

    saveCustomSections(updatedSections);
    saveSectionOrder(updatedOrder);

    set({ 
      sections: updatedSections,
      sectionOrder: updatedOrder,
      predefinedSections: updatedPredefinedSections
    });

    return newSection;
  },

  updateSection: (updatedSection) => {
    set(state => {
      const updatedSections = state.sections.map(section =>
        section.id === updatedSection.id ? { ...section, ...updatedSection } : section
      );
      saveCustomSections(updatedSections);
      return { sections: updatedSections };
    });
  },

  removeSection: (id) => {
    set((state) => {
      const sectionToRemove = state.sections.find(section => section.id === id);
      const updatedSections = state.sections.filter(section => section.id !== id);
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
        sections: updatedSections,
        sectionOrder: state.sectionOrder.filter(sectionId => sectionId !== id),
        predefinedSections: updatedPredefinedSections
      };
    });
  },

  updateSectionOrder: (newOrder) => {
    set({ sectionOrder: newOrder });
    saveSectionOrder(newOrder);
  },

  resetSections: () => {
    set({ 
      sections: [],
      sectionOrder: ['career', 'education'],
      predefinedSections: {}
    });
    Promise.all([
      saveCustomSections([]),
      saveSectionOrder(['career', 'education'])
    ]).catch(error => console.error('섹션 초기화 중 오류 발생:', error));
  },
}));

export default useResumeStore;