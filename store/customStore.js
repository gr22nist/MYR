import { create } from 'zustand';
import { generateUUID } from '@/utils/uuid';
import { 
  saveCustomSections, 
  loadCustomSections as loadCustomSectionsDB, 
  deleteCustomSection, 
  loadSectionOrder as loadSectionOrderFromDB, 
  saveSectionOrder,
  loadEncryptedItems, 
  loadEncryptedSectionOrder 
} from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import { resetAllStores } from '@/utils/resetStores';
import useResumeStore from './resumeStore';

const initialState = {
  customSections: [],
  sectionOrder: [],
  predefinedSections: {},
};

const usecustomStore = create((set, get) => ({
  ...initialState,

  loadCustomSections: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const [savedSections, savedOrder] = await Promise.all([
        loadCustomSectionsDB(),
        loadSectionOrderFromDB()
      ]);

      // savedOrder가 배열인지 확인하고, 아니면 빈 배열 사용
      const order = Array.isArray(savedOrder) ? savedOrder : [];

      const predefinedSections = savedSections.reduce((acc, section) => {
        if (section.type !== CUSTOM_SECTIONS.type) {
          acc[section.type] = true;
        }
        return acc;
      }, {});

      set({ 
        customSections: savedSections, 
        sectionOrder: order,
        predefinedSections,
        isLoading: false
      });
    } catch (error) {
      console.error('커스텀 섹션 로딩 중 오류:', error);
      set({ isLoading: false });
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
    // 기존 순서를 유지하면서 새 섹션 추가
    const updatedOrder = Array.isArray(sectionOrder) 
      ? [...sectionOrder, newSection.id] 
      : ['career', 'education', newSection.id]; // 기본 섹션 포함

    const updatedPredefinedSections = { ...predefinedSections };
    if (type !== CUSTOM_SECTIONS.type) {
      updatedPredefinedSections[type] = true;
    }

    set({ 
      customSections: updatedSections,
      sectionOrder: updatedOrder,
      predefinedSections: updatedPredefinedSections
    });

    // 비동기 작업을 Promise.all로 처리
    Promise.all([
      saveCustomSections(updatedSections),
      useResumeStore.getState().updateSectionOrder(updatedOrder)
    ]).catch((error) => {
      console.error('저장 중 오류 발생:', error);
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
    const resetcustomStore = () => set(initialState);
    const resetResumeStore = () => {
    };

    resetAllStores(resetResumeStore, resetcustomStore);
  },

  exportCustomSections: async () => {
    const [customSections, sectionOrder] = await Promise.all([
      loadEncryptedItems('customSections'),
      loadEncryptedSectionOrder()
    ]);
    console.log('Exporting custom sections:', customSections, 'Section order:', sectionOrder);
    return {
      customSections,
      sectionOrder
    };
  },

  loadSectionOrder: async () => {
    try {
      const order = await loadSectionOrderFromDB();
      set({ sectionOrder: order });
      return order;
    } catch (error) {
      console.error('섹션 순서 로딩 중 오류:', error);
      return [];
    }
  },
}));

export default usecustomStore;
