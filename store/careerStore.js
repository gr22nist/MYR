import { create } from 'zustand';
import { createBaseActions } from '@/utils/storeUtils';
import { loadCareers, saveCareers } from '@/utils/indexedDB';
import { generateUUID } from '@/utils/uuid';

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
  careers: [createInitialCareer()],
  status: 'idle',
  error: null,
  ...createBaseActions('careers', loadCareers, saveCareers),

  addCareer: (newCareer) => {
    const { add } = get();
    add({ ...newCareer, id: generateUUID() });
  },

  updateCareer: (updatedCareer) => {
    const { update } = get();
    update(updatedCareer);
  },

  deleteCareer: (id) => {
    const { remove } = get();
    remove(id);
  },

  reorderCareers: (oldIndex, newIndex) => {
    const { reorder } = get();
    reorder(oldIndex, newIndex);
  },

  resetCareers: () => {
    const { reset } = get();
    reset([createInitialCareer()]);
  },

  loadCareers: async () => {
    const { load } = get();
    await load();
  },

  saveCareers: () => {
    const { careers } = get();
    saveCareers(careers);
  },
}));

export default useCareerStore;