import { create } from 'zustand';
import { loadEducations as loadEducationsFromDB, saveEducations as saveEducationsToDB} from '@/utils/indexedDB';
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
        .sort((a, b) => a.order - b.order)
        .map((education, index) => ({ ...education, order: index }));
      set({
        educations: sortedEducations.length > 0 ? sortedEducations : [createInitialEducation()],
        status: 'seccess'
      });
    } catch (error) {
      set({ error, status: 'error'});
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
      const newEducations = state.educations.map(edu => 
        edu.id === updatedEducation.id ? { ...edu, ...updatedEducation } : edu
      );
      if(JSON.stringify(newEducations) !== JSON.stringify(state.educations)) {
        useResumeStore.getState().updateSection({ id: 'education', type: 'education', items: newEducations });
        return { educations: newEducations };
      }
      return state;
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

}));

export default useEducationStore;