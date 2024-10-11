import { useCallback, useMemo } from 'react';
import useResumeStore from '@/store/resumeStore';
import useCustomSectionsStore from '@/store/customStore';

const useResumeSections = () => {
  const { 
    sections,
    sectionOrder,
    isLoaded,
    isLoading,
    loadAllSections,
    addSection: addResumeSection,
    updateSection,
    removeSection,
    updateSectionOrder,
    toggleExpand,
    toggleAllSections,
    expandedSections,
    areAllSectionsExpanded
  } = useResumeStore();

  const { addCustomSection } = useCustomSectionsStore();

  const orderedSections = useMemo(() => {
    if (!Array.isArray(sections) || sections.length === 0 || !Array.isArray(sectionOrder)) {
      return [];
    }
    const orderedSections = sectionOrder
      .map(sectionId => sections.find(section => section && section.id === sectionId))
      .filter(Boolean);
    
    const remainingSections = sections.filter(section => section && !sectionOrder.includes(section.id));
    
    return Array.from(new Set([...orderedSections, ...remainingSections].map(s => s.id)))
      .map(id => [...orderedSections, ...remainingSections].find(s => s.id === id));
  }, [sections, sectionOrder]);

  const addSection = useCallback((type) => {
    if (type === 'career' || type === 'education') {
      return addResumeSection(type);
    } else {
      return addCustomSection(type);
    }
  }, [addResumeSection, addCustomSection]);

  return {
    sections: orderedSections,
    sectionOrder,
    loadAllSections,
    addSection,
    updateSection,
    removeSection,
    updateSectionOrder,
    isLoaded,
    isLoading,
    toggleExpand,
    toggleAllSections,
    expandedSections,
    areAllSectionsExpanded
  };
};

export default useResumeSections;