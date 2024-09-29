import { useCallback } from 'react';
import useCustomStore from '@/store/customSectionsStore';

const useCustomSections = () => {
  const { 
    customSections, 
    loadCustomSections, 
    addCustomSection, 
    updateCustomSection, 
    removeCustomSection 
  } = useCustomStore();

  const loadSections = useCallback(async () => {
    await loadCustomSections();
  }, [loadCustomSections]);

  return {
    customSections,
    loadSections,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
  };
};

export default useCustomSections;
