import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import useResumeStore from '@/store/resumeStore';
import useCustomSectionsStore from '@/store/customSectionsStore';

const useResumeSections = () => {
  const { 
    careerSection,
    educationSection,
    loadAllSections: storeLoadAllSections, 
    updateSection: updateResumeSection,
    sectionOrder: resumeSectionOrder,
    updateSectionOrder: updateResumeSectionOrder
  } = useResumeStore();

  const {
    customSections,
    loadCustomSections,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    sectionOrder: customSectionOrder,
    updateSectionOrder: updateCustomSectionOrder
  } = useCustomSectionsStore();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadAllSections = useCallback(async () => {
    if (!isLoaded && !isLoading) {
      setIsLoading(true);
      try {
        await Promise.all([storeLoadAllSections(), loadCustomSections()]);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load sections:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [storeLoadAllSections, loadCustomSections, isLoaded, isLoading]);

  useEffect(() => {
    loadAllSections();
  }, [loadAllSections]);

  const sections = useMemo(() => {
    const defaultSections = [
      { id: 'career', type: 'career', title: '경력', items: [] },
      { id: 'education', type: 'education', title: '학력', items: [] }
    ];

    const allSections = [
      careerSection || defaultSections[0],
      educationSection || defaultSections[1],
      ...(Array.isArray(customSections) ? customSections : [])
    ].filter(Boolean);

    // 중복 제거
    return Array.from(new Set(allSections.map(s => s.id)))
      .map(id => allSections.find(s => s.id === id) || defaultSections.find(s => s.id === id));
  }, [careerSection, educationSection, customSections]);

  const sectionOrder = useMemo(() => {
    // 중복 제거
    return Array.from(new Set([...resumeSectionOrder, ...customSectionOrder]));
  }, [resumeSectionOrder, customSectionOrder]);

  const updateSection = useCallback((id, updatedSection) => {
    if (id === 'career' || id === 'education') {
      updateResumeSection(id, updatedSection);
    } else {
      updateCustomSection(id, updatedSection);
    }
  }, [updateResumeSection, updateCustomSection]);

  const removeSection = useCallback((id) => {
    if (id !== 'career' && id !== 'education') {
      removeCustomSection(id);
    }
  }, [removeCustomSection]);

  const updateSectionOrder = useCallback((newOrder) => {
    const resumeOrder = newOrder.filter(id => id === 'career' || id === 'education');
    const customOrder = newOrder.filter(id => id !== 'career' && id !== 'education');
    updateResumeSectionOrder(resumeOrder);
    updateCustomSectionOrder(customOrder);
  }, [updateResumeSectionOrder, updateCustomSectionOrder]);

  return {
    sections,
    sectionOrder,
    loadAllSections,
    addSection: addCustomSection,
    updateSection,
    removeSection,
    updateSectionOrder,
    isLoaded,
    isLoading
  };
};

export default useResumeSections;
