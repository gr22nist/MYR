import React, { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Profile from '@/components/resume/profile/Profile';
import UserInfoForm from '@/components/resume/userInfo/UserInfoForm';
import { useResumeActions } from '@/hooks/useResumeActions';
import FloatingControls from '@/components/common/actions/FloatingControls';
import CustomForm from '@/components/resume/custom/CustomForm';
import useResumeSections from '@/hooks/useResumeSections';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import ResetModal from '@/components/common/actions/ResetModal';
import usecustomStore from '@/store/customStore';
import DataActions from '@/components/common/actions/DataActions';
import useResumeStore from '@/store/resumeStore';
import {
  loadCareers,
  loadEducations,
  loadUserInfo,
  loadProfilePhoto,
  loadProfileData,
  loadCustomSections,
  loadSectionOrder,
  saveCareers,
  saveEducations,
  saveUserInfo,
  saveProfilePhoto,
  saveProfileData,
  saveCustomSections,
  saveSectionOrder
} from '@/utils/indexedDB';
import useProfileStore from '@/store/profileStore';
import useCareerStore from '@/store/careerStore';
import useEducationStore from '@/store/educationStore';
import useUserInfoStore from '@/store/userInfoStore';
import useSectionOrderStore from '@/store/sectionOrderStore';
import { exportAllData, importData } from '@/utils/indexedDB';

const DynamicSortableSectionList = dynamic(() => import('@/components/common/SortableSectionList'), {
  ssr: false,
});

const Resume = () => {
  const { handleReset } = useResumeActions();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { updateSectionOrder } = useSectionOrderStore();
  
  const { 
    sections,
    sectionOrder,
    isLoading,
    loadAllSections, 
    updateSection, 
    removeSection, 
    addSection,
  } = useResumeSections();

  const [expandedSections, setExpandedSections] = useState({});
  const [areAllSectionsExpanded, setAreAllSectionsExpanded] = useState(true);

  useEffect(() => {
    loadAllSections();
  }, [loadAllSections]);

  useEffect(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      setExpandedSections(prevState => {
        const newState = { ...prevState };
        sections.forEach(section => {
          if (section && 'id' in section && !(section.id in newState)) {
            newState[section.id] = true;
          }
        });
        return newState;
      });
    }
  }, [sections]);

  const orderedSections = useMemo(() => {
    if (!Array.isArray(sections) || !Array.isArray(sectionOrder)) {
      return [];
    }
    const orderedSections = sectionOrder
      .map(sectionId => sections.find(section => section && section.id === sectionId))
      .filter(Boolean);
    
    const remainingSections = sections.filter(section => section && !sectionOrder.includes(section.id));
    
    return Array.from(new Set([...orderedSections, ...remainingSections].map(s => s.id)))
      .map(id => [...orderedSections, ...remainingSections].find(s => s.id === id));
  }, [sections, sectionOrder]);

  const handleDeleteSection = useCallback((id) => {
    removeSection(id);
  }, [removeSection]);

  const toggleExpand = useCallback((id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const handleResetClick = () => setIsResetModalOpen(true);

  const handleConfirmReset = async () => {
    try {
      await handleReset();
      setIsResetModalOpen(false);
      setExpandedSections({});
      await loadAllSections();
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
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
      setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
      loadAllSections();
    }
  }, [addSection, loadAllSections]);

  const toggleAllSections = useCallback(() => {
    const newExpandedState = !areAllSectionsExpanded;
    setExpandedSections(prev => {
      const newState = {};
      orderedSections.forEach(section => {
        newState[section.id] = newExpandedState;
      });
      return newState;
    });
    setAreAllSectionsExpanded(newExpandedState);
  }, [areAllSectionsExpanded, orderedSections]);

  const { exportProfile, loadProfile } = useProfileStore();
  const { exportCareers } = useCareerStore();
  const { exportEducations } = useEducationStore();
  const { exportCustomSections } = usecustomStore();
  const { exportUserInfo } = useUserInfoStore();

  const handleExport = async () => {
    try {
      const exportData = await exportAllData();
      if (!exportData) {
        throw new Error('내보낼 데이터가 없습니다.');
      }
      return exportData;
    } catch (error) {
      console.error('데이터 내보내기 준비 중 오류 발생:', error);
      console.error('오류 스택:', error.stack);
      throw error;
    }
  };

  const handleImport = async (importedData) => {
    try {
      await importData(importedData);
      // 데이터 다시 로드
      loadAllSections();
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      throw error;
    }
  };

  if (isLoading || !sections.length) {
    return <SkeletonLoader />;
  }

  return (
    <div className='layout-container'>
      <DataActions 
        onExport={handleExport} 
        onImport={handleImport}
        dataType="이력서"
      />
      <Profile />
      <UserInfoForm />
      <DynamicSortableSectionList
        sections={orderedSections}
        onSectionChange={updateSection}
        onDelete={handleDeleteSection}
        onReorder={handleReorder}
        expandedSections={expandedSections}
        onToggleExpand={toggleExpand}
      />
      <CustomForm onAddSection={handleAddSection} />
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
      <FloatingControls 
        onReset={handleResetClick}
        onToggleAllSections={toggleAllSections}
        areAllSectionsExpanded={areAllSectionsExpanded}
      />
    </div>
  );
};

export default Resume;
