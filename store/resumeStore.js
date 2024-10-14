import { create } from 'zustand';
import { generateUUID, ensureUUID, ensureUUIDForArray } from '@/utils/uuid';
import { 
  loadCareers, 
  loadEducations, 
  loadCustomSections, 
  saveCareers,
  saveEducations,
  saveCustomSections,
  deleteSection
} from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import useSectionOrderStore from './sectionOrderStore';

const initialState = {
  sections: [
    { id: 'career', type: 'career', title: '경력', items: [] },
    { id: 'education', type: 'education', title: '학력', items: [] },
  ],
  error: null,
};

const useResumeStore = create((set, get) => ({
  ...initialState,
  
  loadAllSections: async () => {
    try {
      const [careers, educations, customSections] = await Promise.all([
        loadCareers(),
        loadEducations(),
        loadCustomSections()
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
        error: null
      });
    } catch (error) {
      console.error('Error loading all sections:', error);
      set({ error: error.message });
    }
  },

  addSection: (type) => {
    const { sections } = get();
    const newSection = ensureUUID({
      type,
      title: type === CUSTOM_SECTIONS.type ? '' : PREDEFINED_SECTIONS[type] || '새 섹션',
      items: []
    });
    const updatedSections = [...sections, newSection];
    
    set({ sections: updatedSections, error: null });

    if (type === 'career') {
      saveCareers(updatedSections.find(s => s.type === 'career').items).catch(error => set({ error: error.message }));
    } else if (type === 'education') {
      saveEducations(updatedSections.find(s => s.type === 'education').items).catch(error => set({ error: error.message }));
    } else {
      saveCustomSections(updatedSections.filter(s => !['career', 'education'].includes(s.type))).catch(error => set({ error: error.message }));
    }
    
    useSectionOrderStore.getState().addSectionToOrder(newSection.id);
    
    return newSection;
  },

  updateSection: (updatedSection) => {
    set(state => {
      const updatedSections = state.sections.map(section =>
        section.id === updatedSection.id ? { ...section, ...updatedSection } : section
      );
      
      if (updatedSection.type === 'career') {
        saveCareers(updatedSection.items).catch(error => set({ error: error.message }));
      } else if (updatedSection.type === 'education') {
        saveEducations(updatedSection.items).catch(error => set({ error: error.message }));
      } else {
        saveCustomSections([updatedSection]).catch(error => set({ error: error.message }));
      }
      
      return { sections: updatedSections, error: null };
    });
  },

  removeSection: (id) => {
    set(state => {
      const sectionToRemove = state.sections.find(section => section.id === id);
      if (sectionToRemove && ['career', 'education'].includes(sectionToRemove.type)) {
        console.warn('Cannot remove career or education sections');
        return { ...state, error: 'Cannot remove career or education sections' };
      }

      const updatedSections = state.sections.filter(section => section.id !== id);
      
      saveCustomSections(updatedSections.filter(s => !['career', 'education'].includes(s.type)))
        .catch(error => set({ error: error.message }));
      deleteSection(id).catch(error => set({ error: error.message }));
      
      useSectionOrderStore.getState().removeSectionFromOrder(id);
      
      return { sections: updatedSections, error: null };
    });
  },

  resetSections: async () => {
    try {
      await Promise.all([
        saveCareers([]),
        saveEducations([]),
        saveCustomSections([])
      ]);
      set({
        sections: [
          { id: 'career', type: 'career', title: '경력', items: [] },
          { id: 'education', type: 'education', title: '학력', items: [] },
        ],
        error: null
      });
      useSectionOrderStore.getState().updateSectionOrder(['career', 'education']);
      return true;
    } catch (error) {
      console.error('섹션 리셋 중 오류:', error);
      set({ error: error.message });
      return false;
    }
  },
}));

export default useResumeStore;
