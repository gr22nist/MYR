import { create } from 'zustand';
import { generateUUID, ensureUUID, ensureUUIDForArray } from '@/utils/uuid';
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
    try {
      const [careers, educations, customSections, order] = await Promise.all([
        loadCareers(),
        loadEducations(),
        loadCustomSections(),
        loadSectionOrder()
      ]);

      const sectionsWithUUID = [
        { id: 'career', type: 'career', title: '경력', items: ensureUUIDForArray(careers || []) },
        { id: 'education', type: 'education', title: '학력', items: ensureUUIDForArray(educations || []) },
        ...(customSections || []).map(section => ({
          ...section,
          items: ensureUUIDForArray(section.items || [])
        }))
      ];

      set({ 
        sections: sectionsWithUUID,
        sectionOrder: order || ['career', 'education']
      });
    } catch (error) {
      console.error('Error loading all sections:', error);
    }
  },

  addSection: (type) => {
    const { sections, sectionOrder } = get();
    const newSection = ensureUUID({
      type,
      title: type === CUSTOM_SECTIONS.type ? '' : PREDEFINED_SECTIONS[type] || '새 섹션',
      items: []
    });
    const updatedSections = [...sections, newSection];
    const updatedOrder = [...sectionOrder, newSection.id];
    
    set({ sections: updatedSections, sectionOrder: updatedOrder });

    if (type === 'career') {
      saveCareers(updatedSections.find(s => s.type === 'career').items);
    } else if (type === 'education') {
      saveEducations(updatedSections.find(s => s.type === 'education').items);
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
    set(initialState);
    saveCareers([]);
    saveEducations([]);
    saveCustomSections([]);
    saveSectionOrder(['career', 'education']);
  },
}));

export default useResumeStore;
