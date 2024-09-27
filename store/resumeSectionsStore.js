import { create } from 'zustand';

const useResumeSectionsStore = create((set) => ({
  sections: [],
  setSections: (newSections) => set({ sections: newSections }),
  updateSection: (updatedSection) => set((state) => ({
    sections: state.sections.map(section => 
      section.id === updatedSection.id ? updatedSection : section
    )
  })),
  removeSection: (id) => set((state) => ({
    sections: state.sections.filter(section => section.id !== id)
  })),
  reorderSections: (oldIndex, newIndex) => set((state) => {
    const newSections = Array.from(state.sections);
    const [reorderedItem] = newSections.splice(oldIndex, 1);
    newSections.splice(newIndex, 0, reorderedItem);
    return { sections: newSections };
  }),
  addCustomSection: (newSection) => set((state) => ({
    sections: [...state.sections, { ...newSection, id: Date.now().toString() }]
  }))
}));

export default useResumeSectionsStore;
