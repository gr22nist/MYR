import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { 
  loadCareers, 
  loadEducations, 
  loadCustomSections, 
  saveCareers,
  saveEducations,
  saveCustomSections,
  deleteSection, 
  saveSectionOrder, 
  loadSectionOrder
} from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import { resetAllStores } from '@/utils/resetStores';

const initialState = {
  sections: [
    { id: 'career', type: 'career', title: '경력', items: [] },
    { id: 'education', type: 'education', title: '학력', items: [] },
  ],
  sectionOrder: ['career', 'education'],
};

const useResumeStore = create((set, get) => ({
  ...initialState,
  
  loadAllSections: async () => {
    // 이 부분은 변경 없음
  },

  addSection: (type) => {
    const { sections, sectionOrder } = get();
    const newSection = {
      id: uuidv4(),
      type,
      title: type === CUSTOM_SECTIONS.type ? '' : PREDEFINED_SECTIONS[type] || '새 섹션',
      items: []
    };
    const updatedSections = [...sections, newSection];
    const updatedOrder = [...sectionOrder, newSection.id];
    
    set({ sections: updatedSections, sectionOrder: updatedOrder });
    
    // 섹션 타입에 따라 적절한 저장 함수 호출
    if (type === 'career') {
      saveCareers(updatedSections.filter(s => s.type === 'career').map(s => s.items).flat());
    } else if (type === 'education') {
      saveEducations(updatedSections.filter(s => s.type === 'education').map(s => s.items).flat());
    } else {
      saveCustomSections(updatedSections.filter(s => !['career', 'education'].includes(s.type)));
    }
    
    saveSectionOrder(updatedOrder);
    
    return newSection;
  },

  updateSection: (updatedSection) => {
    set(state => {
      const updatedSections = state.sections.map(section =>
        section.id === updatedSection.id ? { ...section, ...updatedSection } : section
      );
      
      // 섹션 타입에 따라 적절한 저장 함수 호출
      if (updatedSection.type === 'career') {
        saveCareers(updatedSection.items);
      } else if (updatedSection.type === 'education') {
        saveEducations(updatedSection.items);
      } else {
        saveCustomSections([updatedSection]);
      }
      
      return { sections: updatedSections };
    });
  },

  removeSection: (id) => {
    set(state => {
      const sectionToRemove = state.sections.find(section => section.id === id);
      if (sectionToRemove && ['career', 'education'].includes(sectionToRemove.type)) {
        console.warn('Cannot remove career or education sections');
        return state;
      }

      const updatedSections = state.sections.filter(section => section.id !== id);
      const updatedOrder = state.sectionOrder.filter(sectionId => sectionId !== id);
      
      saveCustomSections(updatedSections.filter(s => !['career', 'education'].includes(s.type)));
      saveSectionOrder(updatedOrder);
      deleteSection(id);
      return { sections: updatedSections, sectionOrder: updatedOrder };
    });
  },

  updateSectionOrder: (newOrder) => {
    set({ sectionOrder: newOrder });
    saveSectionOrder(newOrder);
  },

  resetSections: () => {
    const resetResumeStore = () => set(initialState);
    const resetCustomSectionsStore = () => {
    };

    resetAllStores(resetResumeStore, resetCustomSectionsStore);
  },
}));

export default useResumeStore;