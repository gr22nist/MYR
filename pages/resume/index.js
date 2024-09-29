import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { layout } from '@/styles/constLayout';
import Profile from '@/components/resume/profile/Profile';
import UserInfoForm from '@/components/resume/userInfo/UserInfoForm';
import { useResumeActions } from '@/hooks/useResumeActions';
import FloatingControls from '@/components/common/actions/FloatingControls';
import CustomForm from '@/components/resume/custom/CustomForm';
import useResumeSections from '@/hooks/useResumeSections';
import SortableSectionList from '@/components/common/SortableSectionList';
import ResetModal from '@/components/common/actions/ResetModal';

const Resume = () => {
  const { handleReset, handlePreview } = useResumeActions();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const { 
    sections,
    sectionOrder,
    loadAllSections, 
    updateSection, 
    removeSection, 
    addSection,
    updateSectionOrder,
    isLoaded
  } = useResumeSections();

  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (!isLoaded) {
      console.log('Loading sections in Resume component...');
      loadAllSections();
    }
  }, [isLoaded, loadAllSections]);

  useEffect(() => {
    console.log('Current sections:', sections);
    // 섹션이 로드되면 모든 섹션을 펼친 상태로 초기화
    if (sections.length > 0) {
      const initialExpandedState = sections.reduce((acc, section) => {
        acc[section.id] = true;
        return acc;
      }, {});
      setExpandedSections(initialExpandedState);
    }
  }, [sections]);

  const orderedSections = useMemo(() => {
    if (!sectionOrder || !sections) return [];
    return sectionOrder
      .map(id => sections.find(section => section.id === id))
      .filter(Boolean);
  }, [sectionOrder, sections]);

  useEffect(() => {
    console.log('Current sections:', sections);
  }, [sections]);

  const handleDeleteSection = useCallback((id) => {
    removeSection(id);
  }, [removeSection]);

  const toggleExpand = useCallback((id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  
  const handleResetClick = () => setIsResetModalOpen(true);

  const handleConfirmReset = async () => {
    try {
      await handleReset();
      setIsResetModalOpen(false);
      setExpandedSections({}); // 로컬 상태 초기화
      await loadAllSections(); // 섹션 다시 로드
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
      // 오류 처리 (예: 사용자에게 알림)
    }
  };

  const handleReorder = useCallback((oldIndex, newIndex) => {
    const newOrder = Array.from(orderedSections);
    const [reorderedItem] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, reorderedItem);
    updateSectionOrder(newOrder.map(section => section.id));
  }, [orderedSections, updateSectionOrder]);

  return (
    <div className={`${layout.container}`}>
      <Profile />
      <UserInfoForm />
      <SortableSectionList
        sections={orderedSections}
        onSectionChange={updateSection}
        onDelete={handleDeleteSection}
        onReorder={handleReorder}
        expandedSections={expandedSections}
        onToggleExpand={toggleExpand}
      />
      <CustomForm onAddSection={addSection} />
      <FloatingControls onPreview={handlePreview} onReset={handleResetClick} />
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

export default Resume;