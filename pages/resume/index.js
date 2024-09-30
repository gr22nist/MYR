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
import useCustomSectionsStore from '@/store/customSectionsStore';

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
    isLoaded,
    isLoading // 새로 추가된 isLoading 상태
  } = useResumeSections();

  const { loadCustomSections } = useCustomSectionsStore();

  const [expandedSections, setExpandedSections] = useState({});
  const [areAllSectionsExpanded, setAreAllSectionsExpanded] = useState(true);

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadAllSections();
      loadCustomSections();
    }
  }, [isLoaded, isLoading, loadAllSections, loadCustomSections]);

  useEffect(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      setExpandedSections(prevState => {
        const newState = { ...prevState };
        let hasChanges = false;
        sections.forEach(section => {
          if (section && typeof section === 'object' && 'id' in section && !(section.id in newState)) {
            newState[section.id] = true;
            hasChanges = true;
          }
        });
        return hasChanges ? newState : prevState;
      });
    }
  }, [sections]); // sections만 의존성으로 추가

  const orderedSections = useMemo(() => {
    if (!Array.isArray(sections) || sections.length === 0 || !Array.isArray(sectionOrder)) {
      return [];
    }
    const orderedSections = sectionOrder
      .map(sectionId => sections.find(section => section && section.id === sectionId))
      .filter(Boolean);
    
    // Add any sections that are not in the order
    const remainingSections = sections.filter(section => section && !sectionOrder.includes(section.id));
    
    // 중복 제거
    return Array.from(new Set([...orderedSections, ...remainingSections].map(s => s.id)))
      .map(id => [...orderedSections, ...remainingSections].find(s => s.id === id));
  }, [sections, sectionOrder]);

  useEffect(() => {
    // 이 useEffect는 비어있지만, 향후 sections 변경에 따른 추가 로직이 필요할 경우 사용할 수 있습니다.
  }, [sections]);

  const handleDeleteSection = useCallback((id) => {
    removeSection(id);
  }, [removeSection]);

  const toggleExpand = useCallback((id) => {
    setExpandedSections(prev => {
      const newState = { ...prev };
      newState[id] = !prev[id];
      // 펼칠 때는 해당 섹션만 펼치고, 나머지는 접습니다.
      if (newState[id]) {
        Object.keys(newState).forEach(key => {
          if (key !== id) newState[key] = false;
        });
      }
      return newState;
    });
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

  const handleAddSection = useCallback((type) => {
    const newSection = addSection(type);
    if (newSection) {
      console.log('New section added:', newSection);
      setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
      // 새로운 섹션이 추가된 후 상태 업데이트
      loadAllSections();
    }
  }, [addSection, loadAllSections]);

  const toggleAllSections = useCallback(() => {
    const newExpandedState = !areAllSectionsExpanded;
    setExpandedSections(prev => {
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = newExpandedState;
      });
      return newState;
    });
    setAreAllSectionsExpanded(newExpandedState);
  }, [areAllSectionsExpanded]);

  if (isLoading) {
    return <div className={`${layout.container}`}>Loading...</div>;
  }

  return (
    <div className={`${layout.container}`}>
      <Profile />
      <UserInfoForm />
      {orderedSections.length > 0 && (
        <SortableSectionList
          sections={orderedSections}
          onSectionChange={updateSection}
          onDelete={handleDeleteSection}
          onReorder={handleReorder}
          expandedSections={expandedSections}
          onToggleExpand={toggleExpand}
        />
      )}
      <CustomForm onAddSection={handleAddSection} />
      <FloatingControls 
        onPreview={handlePreview} 
        onReset={handleResetClick}
        onToggleAllSections={toggleAllSections}
        areAllSectionsExpanded={areAllSectionsExpanded}
      />
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

export default Resume;