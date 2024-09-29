import { useCallback, useEffect, useState } from 'react';
import useResumeStore from '@/store/resumeStore';

const useResumeSections = () => {
  const { 
    sections: storeSections, 
    sectionOrder: storeSectionOrder,
    loadSections, 
    addSection, 
    updateSection, 
    removeSection,
    updateSectionOrder
  } = useResumeStore();

  const [isLoaded, setIsLoaded] = useState(false);

  const loadAllSections = useCallback(async () => {
    if (!isLoaded) {
      console.log('Loading all sections...');
      await loadSections();
      setIsLoaded(true);
      console.log('Sections loaded:', useResumeStore.getState().sections);
    }
  }, [loadSections, isLoaded]);

  useEffect(() => {
    loadAllSections();
  }, [loadAllSections]);

  return {
    sections: storeSections,
    sectionOrder: storeSectionOrder,
    loadAllSections,
    addSection,
    updateSection,
    removeSection,
    updateSectionOrder,
    isLoaded
  };
};

export default useResumeSections;
