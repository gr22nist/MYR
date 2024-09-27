import { create } from 'zustand';
import { loadCareers as loadCareersFromDB, saveCareers as saveCareersToDb } from '@/utils/indexedDB';

const createInitialCareer = () => ({
  id: `career-${Date.now()}`,
  companyName: '',
  position: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  tasks: ''
});

const useCareerStore = create((set, get) => ({
  careers: {
    items: [createInitialCareer()],
    status: 'idle',
    error: null,
  },
  addCareer: (newCareer) => {
    set((state) => ({
      careers: { ...state.careers, items: [...state.careers.items, newCareer] }
    }));
    get().saveCareers();
  },
  updateCareer: (updatedCareer) => {
    set((state) => ({
      careers: {
        ...state.careers,
        items: state.careers.items.map(career => 
          career.id === updatedCareer.id ? updatedCareer : career
        )
      }
    }));
    get().saveCareers();
  },
  deleteCareer: (id) => {
    set((state) => ({
      careers: {
        ...state.careers,
        items: state.careers.items.filter(career => career.id !== id)
      }
    }));
    get().saveCareers();
  },
  reorderCareers: (oldIndex, newIndex) => set((state) => {
    const newItems = [...state.careers.items];
    const [reorderedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, reorderedItem);
    return { careers: { ...state.careers, items: newItems } };
  }),
  resetCareers: () => {
    set((state) => ({
      careers: { items: [createInitialCareer()], status: 'idle', error: null }
    }));
    get().saveCareers();
  },
  loadCareers: async () => {
    set((state) => ({ careers: { ...state.careers, status: 'loading' } }));
    try {
      const careers = await loadCareersFromDB();
      set((state) => ({
        careers: {
          ...state.careers,
          items: careers.length > 0 ? careers : [createInitialCareer()],
          status: 'succeeded'
        }
      }));
    } catch (error) {
      set((state) => ({
        careers: { ...state.careers, status: 'failed', error: error.message }
      }));
    }
  },
  saveCareers: async () => {
    try {
      const careers = get().careers.items;
      await saveCareersToDb(careers);
    } catch (error) {
      set((state) => ({
        careers: { ...state.careers, status: 'failed', error: error.message }
      }));
    }
  },
}));

export default useCareerStore;
