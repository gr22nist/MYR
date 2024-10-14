import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import useResumeStore from '@/store/resumeStore';
import useCustomStore from '@/store/customStore';
import useSectionOrderStore from '@/store/sectionOrderStore';

const useResumeSections = () => {
  const { 
    sections: resumeSections,
    loadAllSections: storeLoadAllSections, 
    updateSection: updateResumeSection,
  } = useResumeStore();

  const {
    customSections,
    loadCustomSections,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
  } = useCustomStore();

  const {
    sectionOrder,
    loadSectionOrder,
    updateSectionOrder,
    addSectionToOrder,
    removeSectionFromOrder
  } = useSectionOrderStore();

  const [isLoading, setIsLoading] = useState(true);

  const loadAllSections = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        storeLoadAllSections(),
        loadCustomSections(),
        loadSectionOrder()
      ]);
    } catch (error) {
      console.error('Failed to load sections:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storeLoadAllSections, loadCustomSections, loadSectionOrder]);

  useEffect(() => {
    loadAllSections();
  }, [loadAllSections]);

  const sections = useMemo(() => {
    const basicSections = [
      { id: 'career', type: 'career', title: '경력', items: [] },
      { id: 'education', type: 'education', title: '학력', items: [] }
    ];
    const existingBasicSections = resumeSections.filter(s => s.type === 'career' || s.type === 'education');
    const mergedBasicSections = basicSections.map(bs => {
      const existing = existingBasicSections.find(es => es.type === bs.type);
      return existing || bs;
    });
    return [...mergedBasicSections, ...customSections];
  }, [resumeSections, customSections]);

  const updateSection = useCallback((id, updatedSection) => {
    if (id === 'career' || id === 'education') {
      updateResumeSection(id, updatedSection);
    } else {
      updateCustomSection(id, updatedSection);
    }
  }, [updateResumeSection, updateCustomSection]);

  const addSection = useCallback(async (type) => {
    const newSection = addCustomSection(type);
    await addSectionToOrder(newSection.id);
    return newSection;
  }, [addCustomSection, addSectionToOrder]);

  const removeSection = useCallback(async (id) => {
    if (id !== 'career' && id !== 'education') {
      removeCustomSection(id);
      await removeSectionFromOrder(id);
    }
  }, [removeCustomSection, removeSectionFromOrder]);

  return {
    sections,
    sectionOrder,
    loadAllSections,
    addSection,
    updateSection,
    removeSection,
    updateSectionOrder,
    isLoading
  };
};

export default useResumeSections;
