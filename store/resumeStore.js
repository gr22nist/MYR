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
        ...ensureUUIDForArray(careers.map(c => ({ ...c, type: 'career' }))),
        ...ensureUUIDForArray(educations.map(e => ({ ...e, type: 'education' }))),
        ...ensureUUIDForArray(customSections)
      ];

      // ... 나머지 코드
      set({ 
        sections: sectionsWithUUID,
        // ... 나머지 상태 업데이트
      });
    } catch (error) {
      // ... 오류 처리
    }
  },

  addSection: (type) => {
    console.log('resumeStore: 섹션 추가 시작:', type);
    const { sections, sectionOrder } = get();
    const newSection = ensureUUID({
      type,
      title: type === CUSTOM_SECTIONS.type ? '' : PREDEFINED_SECTIONS[type] || '새 섹션',
      items: []
    });
    const updatedSections = [...sections, newSection];
    const updatedOrder = [...sectionOrder, newSection.id];
    
    console.log('resumeStore: 새로운 섹션:', newSection);
    
    set((state) => ({ 
      sections: updatedSections, 
      sectionOrder: updatedOrder 
    }));

    console.log('resumeStore: 상태 업데이트 후');
    console.log('sections:', get().sections);
    console.log('sectionOrder:', get().sectionOrder);

    // 비동기 작업을 Promise.all로 처리
    const savePromises = [];
    
    if (type === 'career') {
      savePromises.push(saveCareers(updatedSections.filter(s => s.type === 'career').map(s => s.items).flat()));
    } else if (type === 'education') {
      savePromises.push(saveEducations(updatedSections.filter(s => s.type === 'education').map(s => s.items).flat()));
    } else {
      savePromises.push(saveCustomSections(updatedSections.filter(s => !['career', 'education'].includes(s.type))));
    }
    
    savePromises.push(saveSectionOrder(updatedOrder));

    Promise.all(savePromises)
      .then(() => {
        console.log('resumeStore: 저장 완료');
      })
      .catch((error) => {
        console.error('resumeStore: 저장 중 오류 발생', error);
      });
    
    console.log('resumeStore: 섹션 추가 완료');
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
    const resetcustomStore = () => {
    };

    resetAllStores(resetResumeStore, resetcustomStore);
  },
}));

export default useResumeStore;
