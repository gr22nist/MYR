import { create } from 'zustand';
import { createBaseActions } from '@/utils/storeUtils';
import { loadEducations, saveEducations } from '@/utils/indexedDB';
import { generateUUID } from '@/utils/uuid';

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
  educations: [createInitialEducation()],
  status: 'idle',
  error: null,
  ...createBaseActions('educations', loadEducations, saveEducations),

  addEducation: (newEducation) => {
    const { add } = get();
    add({ ...newEducation, id: generateUUID() });
  },

  updateEducation: (updatedEducation) => {
    const { update } = get();
    update(updatedEducation);
  },

  deleteEducation: (id) => {
    const { remove } = get();
    remove(id);
  },

  reorderEducations: (oldIndex, newIndex) => {
    const { reorder } = get();
    reorder(oldIndex, newIndex);
  },

  resetEducations: () => {
    const { reset } = get();
    reset([createInitialEducation()]);
  },

  loadEducations: async () => {
    const { load } = get();
    await load();
  },

  saveEducations: () => {
    const { educations } = get();
    saveEducations(educations);
  },
}));

export default useEducationStore;