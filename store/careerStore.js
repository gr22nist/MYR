import { create } from 'zustand';
import { loadCareers as loadCareersFromDB, saveCareers as saveCareersToDB, loadEncryptedItems } from '@/utils/indexedDB';
import { generateUUID } from '@/utils/uuid';
import useResumeStore from './resumeStore';

const createInitialCareer = () => ({
  id: generateUUID(),
  companyName: '',
  position: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  tasks: '',
  order: 0
});

const useCareerStore = create((set, get) => ({
  careers: [],  // 배열로 초기화
  status: 'idle',
  error: null,

  loadCareers: async () => {
    set({ status: 'loading' });
    try {
      const loadedCareers = await loadCareersFromDB();
      const sortedCareers = loadedCareers
        .sort((a, b) => a.order - b.order)
        .map((career, index) => ({ ...career, order: index }));
      set({ 
        careers: sortedCareers.length > 0 ? sortedCareers : [createInitialCareer()], 
        status: 'success' 
      });
    } catch (error) {
      console.error('Error loading careers:', error);
      set({ error, status: 'error' });
    }
  },

  addCareer: () => {
    set(state => {
      const newCareer = createInitialCareer();
      const newCareers = [newCareer, ...state.careers].map((career, index) => ({
        ...career,
        order: index
      }));
      saveCareersToDB(newCareers);
      return { careers: newCareers };
    });
  },
  
  updateCareer: (updatedCareer) => {
    set(state => {
      const newCareers = state.careers.map(career => 
        career.id === updatedCareer.id ? { ...career, ...updatedCareer } : career
      );
      if (JSON.stringify(newCareers) !== JSON.stringify(state.careers)) {
        useResumeStore.getState().updateSection({ id: 'career', type: 'career', items: newCareers });
        return { careers: newCareers };
      }
      return state;
    });
  },
  
  deleteCareer: (id) => {
    set(state => {
      const newCareers = state.careers.filter(career => career.id !== id);
      saveCareersToDB(newCareers);
      return { careers: newCareers };
    });
  },
  
  reorderCareers: (oldIndex, newIndex) => {
    set(state => {
      const newCareers = Array.from(state.careers);
      const [reorderedItem] = newCareers.splice(oldIndex, 1);
      newCareers.splice(newIndex, 0, reorderedItem);
      const updatedCareers = newCareers.map((career, index) => ({
        ...career,
        order: index
      }));
      saveCareersToDB(updatedCareers);
      return { careers: updatedCareers };
    });
  },

  exportCareers: async () => {
    return await loadEncryptedItems('careers');
  },
}));

export default useCareerStore;