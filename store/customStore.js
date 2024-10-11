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
    console.log('addCustomSection 호출됨:', type);
    const { customSections, sectionOrder } = get();
    const updateSectionOrder = useResumeStore.getState().updateSectionOrder;

    // type이 객체인 경우 (이미 생성된 섹션이 전달된 경우)
    if (typeof type === 'object' && type.id) {
      console.log('이미 생성된 섹션이 전달됨:', type);
      return type;
    }

    // custom 타입이 아닌 경우에만 중복 체크
    if (type !== CUSTOM_SECTIONS.type) {
      const existingSection = customSections.find(section => section.type === type);
      if (existingSection) {
        console.log('이미 존재하는 섹션:', type);
        return existingSection;
      }
    }

    const newSection = {
      id: generateUUID(),
      type,
      title: type === CUSTOM_SECTIONS.type ? '' : PREDEFINED_SECTIONS[type] || '새 섹션',
      content: '',
      links: type === 'link' ? [] : undefined,
    };

    console.log('새 섹션 생성:', newSection);

    const updatedSections = [...customSections, newSection];
    const updatedOrder = [...sectionOrder, newSection.id];

    set({
      customSections: updatedSections,
      sectionOrder: updatedOrder
    });

    console.log('상태 업데이트 후 customSections:', updatedSections);
    console.log('상태 업데이트 후 sectionOrder:', updatedOrder);

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