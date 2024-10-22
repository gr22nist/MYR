import { create } from 'zustand';
import { loadEducations as loadEducationsFromDB, saveEducations as saveEducationsToDB } from '@/utils/indexedDB';
import { generateUUID } from '@/utils/uuid';
import useResumeStore from './resumeStore';

const createInitialEducation = () => ({
  id: generateUUID(),
  schoolName: '',
  major: '',
  startDate: '',
  endDate: '',
  department: '',
  isCurrent: false,
  graduationStatus: '졸업',
  order: 0
});

const useEducationStore = create((set, get) => ({
  educations: [],
  status: 'idle',
  error: null,

  loadEducations: async () => {
    set({ status: 'loading' });
    try {
      const loadedEducations = await loadEducationsFromDB();
      const sortedEducations = loadedEducations
        ? loadedEducations.sort((a, b) => a.order - b.order).map((education, index) => ({ ...education, order: index }))
        : [createInitialEducation()];
      set({
        educations: sortedEducations,
        status: 'success'
      });
    } catch (error) {
      console.error('Error loading educations:', error);
      set({ error, status: 'error' });
    }
  },

  addEducation: () => {
    set(state => {
      const newEducation = createInitialEducation();
      const newEducations = [newEducation, ...state.educations].map((edu, index) => ({
        ...edu,
        order: index
      }));
      saveEducationsToDB(newEducations);
      return { educations: newEducations };
    });
  },
  
  updateEducation: (updatedEducation) => {
    set(state => {
      console.log('Updating education:', updatedEducation);
      const newEducations = state.educations.map(edu => 
        edu.id === updatedEducation.id ? updatedEducation : edu
      ).filter(edu => Object.entries(edu).some(([key, v]) => 
        key !== 'id' && key !== 'order' && key !== 'graduationStatus' &&
        v !== '' && v !== false && v != null && v !== undefined &&
        !(typeof v === 'object' && Object.keys(v).length === 0)
      ));
      console.log('Filtered educations:', newEducations);
      
      saveEducationsToDB(newEducations);
      useResumeStore.getState().updateSection({ id: 'education', type: 'education', items: newEducations });
      return { educations: newEducations };
    });
  },
  
  deleteEducation: (id) => {
    set(state => {
      const newEducations = state.educations.filter(edu => edu.id !== id);
      saveEducationsToDB(newEducations);
      return { educations: newEducations };
    });
  },
  
  reorderEducations: (oldIndex, newIndex) => {
    set(state => {
      const newEducations = Array.from(state.educations);
      const [reorderedItem] = newEducations.splice(oldIndex, 1);
      newEducations.splice(newIndex, 0, reorderedItem);
      const updatedEducations = newEducations.map((edu, index) => ({
        ...edu,
        order: index
      }));
      saveEducationsToDB(updatedEducations);
      return { educations: updatedEducations };
    });
  },

  // exportEducations 함수 제거
}));

export default useEducationStore;
