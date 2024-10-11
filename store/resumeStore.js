import { create } from 'zustand';
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
import useCustomSectionsStore from './customStore';
import { clearDatabase } from '@/utils/indexedDB';  // 이 줄을 추가합니다.
import { generateUUID } from '@/utils/uuid';

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
      id: generateUUID(),
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
    }
    // 커스텀 섹션은 여기서 저장하지 않음
    
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

  resetSections: async () => {
    console.log('resetSections 시작');
    
    const resetResumeStore = () => {
      console.log('resetResumeStore 실행');
      set(state => ({
        ...initialState,
        sectionOrder: [] // 명시적으로 빈 배열로 설정
      }));
      console.log('Resume store state after reset:', get());
    };
    
    console.log('clearDatabase 호출');
    await clearDatabase();
    
    console.log('resetAllStores 호출');
    await resetAllStores(resetResumeStore);
    
    console.log('customSections 초기화');
    await useCustomSectionsStore.getState().resetCustomSections();
    console.log('Custom sections after reset:', useCustomSectionsStore.getState().customSections);
    
    console.log('sectionOrder 초기화');
    set(state => ({ ...state, sectionOrder: [] })); // 빈 배열로 설정
    
    console.log('saveSectionOrder 호출');
    await saveSectionOrder([]);
    
    // 저장 후 다시 로드하여 확인
    const loadedSectionOrder = await loadSectionOrder();
    console.log('저장 후 로드된 sectionOrder:', loadedSectionOrder);
    
    if (loadedSectionOrder.length > 0) {
      console.error('sectionOrder가 여전히 존재합니다. 강제로 삭제를 시도합니다.');
      const db = await getDB();
      await db.sectionOrder.where('id').equals('sectionOrder').delete();
      console.log('sectionOrder 강제 삭제 완료');
    }
    
    // 최종 확인
    const finalSectionOrder = await loadSectionOrder();
    console.log('최종 sectionOrder:', finalSectionOrder);
    
    console.log('resetSections 완료');
  },
}));

export default useResumeStore;