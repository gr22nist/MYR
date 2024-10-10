import { create } from 'zustand';
import { 
  saveCustomSections, 
  loadCustomSections as loadCustomSectionsDB, 
  deleteCustomSection, 
  loadSectionOrder, 
  saveSectionOrder,
  loadEncryptedItems, 
  loadEncryptedSectionOrder 
} from '@/utils/indexedDB';
import { CUSTOM_SECTIONS, PREDEFINED_SECTIONS } from '@/constants/resumeConstants';
import { resetAllStores } from '@/utils/resetStores';
import useResumeStore from './resumeStore';
import { generateUUID, ensureUUID, ensureUUIDForArray } from '@/utils/uuid';

const initialState = {
  customSections: [],
  sectionOrder: [],
  predefinedSections: {},
  isLoading: false,
};

const useCustomSectionsStore = create((set, get) => ({
  ...initialState,

  loadCustomSections: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const [savedSections, savedOrder] = await Promise.all([
        loadCustomSectionsDB(),
        loadSectionOrder()
      ]);

      const order = Array.isArray(savedOrder) ? savedOrder : [];

      const predefinedSections = savedSections.reduce((acc, section) => {
        if (section.type !== CUSTOM_SECTIONS.type) {
          acc[section.type] = true;
        }
        return acc;
      }, {});

      set({
        customSections: ensureUUIDForArray(savedSections),
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
    const updateSectionOrder = useResumeStore.getState().updateSectionOrder;

    const newSection = {
      id: generateUUID(),
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

  resetCustomSections: async () => {
    console.log('resetCustomSections 시작');
    set(state => ({
      ...initialState,
      sectionOrder: [] // 명시적으로 빈 배열로 설정
    }));
    await saveCustomSections([]);
    await saveSectionOrder([]);
    console.log('resetCustomSections 완료, 현재 상태:', get());
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
}));

export const useCustomSections = () => {
  const {
    customSections,
    loadCustomSections,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    predefinedSections,
    sectionOrder,
    updateSectionOrder,
    resetCustomSections,
    exportCustomSections
  } = useCustomSectionsStore();

  return {
    customSections,
    loadCustomSections,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    predefinedSections,
    sectionOrder,
    updateSectionOrder,
    resetCustomSections,
    exportCustomSections
  };
};

export default useCustomSectionsStore;