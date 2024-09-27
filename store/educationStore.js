import { create } from 'zustand';
import { loadEducations as loadEducationsFromDB, saveEducations as saveEducationsToDb } from '@/utils/indexedDB';

const createInitialEducation = () => ({
  id: `education-${Date.now()}`,
  schoolName: '',
  major: '',
  startDate: '',
  endDate: '',
  department: '',
  isCurrent: false,
  graduationStatus: '졸업'
});

const useEducationStore = create((set, get) => ({
  educations: {
    items: [createInitialEducation()],
    status: 'idle',
    error: null,
  },
  addEducation: (education) => set((state) => ({
    educations: { ...state.educations, items: [...state.educations.items, education] }
  })),
  updateEducation: (updatedEducation) => set((state) => ({
    educations: {
      ...state.educations,
      items: state.educations.items.map(education => 
        education.id === updatedEducation.id ? updatedEducation : education
      )
    }
  })),
  deleteEducation: (id) => set((state) => ({
    educations: {
      ...state.educations,
      items: state.educations.items.filter(education => education.id !== id)
    }
  })),
  reorderEducations: (oldIndex, newIndex) => set((state) => {
    const newItems = [...state.educations.items];
    const [reorderedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, reorderedItem);
    return { educations: { ...state.educations, items: newItems } };
  }),
  resetEducations: () => set((state) => ({
    educations: { items: [createInitialEducation()], status: 'idle', error: null }
  })),
  loadEducations: async () => {
    set((state) => ({ educations: { ...state.educations, status: 'loading' } }));
    try {
      const educations = await loadEducationsFromDB();
      set((state) => ({
        educations: {
          ...state.educations,
          items: educations.length > 0 ? educations : [createInitialEducation()],
          status: 'succeeded'
        }
      }));
    } catch (error) {
      set((state) => ({
        educations: { ...state.educations, status: 'failed', error: error.message }
      }));
    }
  },
  saveEducations: async () => {
    try {
      const educations = get().educations.items;
      await saveEducationsToDb(educations);
    } catch (error) {
      set((state) => ({
        educations: { ...state.educations, status: 'failed', error: error.message }
      }));
    }
  },
}));

export default useEducationStore;