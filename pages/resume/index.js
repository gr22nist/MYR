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
import useCustomSectionsStore from '@/store/customSectionsStore';
import DataActions from '@/components/common/actions/DataActions';
import useResumeStore from '@/store/resumeStore';
import { getDB } from '@/hooks/dbConfig';
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

const DynamicSortableSectionList = dynamic(() => import('@/components/common/SortableSectionList'), {
  ssr: false,
});

const Resume = () => {
  const { handleReset } = useResumeActions();
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
    isLoading
  } = useResumeSections();

  const { loadCustomSections } = useCustomSectionsStore();

  const { careerSection, educationSection } = useResumeStore();

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
      setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
      // 새로운 섹션이 추가된 후 상태 업데이트
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
  const { exportCustomSections } = useCustomSectionsStore();
  const { exportUserInfo } = useUserInfoStore();

  const handleExport = async () => {
    try {
      console.log('내보내기 함수 시작');
      const profileData = await exportProfile();
      const careersData = await exportCareers();
      const educationsData = await exportEducations();
      const customSectionsData = await exportCustomSections();
      const userInfoData = await exportUserInfo();

      const exportData = {
        profile: profileData,
        careers: careersData,
        educations: educationsData,
        customSections: customSectionsData,
        userInfo: userInfoData,
      };

      console.log('내보내기 데이터:', exportData);

      if (Object.keys(exportData).length === 0) {
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
      await saveProfileData(importedData.profile);
      await saveProfilePhoto(importedData.profilePhoto);
      await saveCareers(importedData.careers);
      await saveEducations(importedData.educations);
      if (importedData.customSections) {
        await saveCustomSections(importedData.customSections.customSections);
        await saveSectionOrder(importedData.customSections.sectionOrder);
      }
      await saveUserInfo(importedData.userInfo);

      // 데이터 다시 로드
      loadAllSections();
      // loadProfile 함수가 없다면 이 줄을 제거하거나 적절한 함수로 대체하세요
      // loadProfile();
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      throw error;
    }
  };

  if (isLoading) {
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
      {orderedSections.length > 0 ? (
        <DynamicSortableSectionList
          sections={orderedSections}
          onSectionChange={updateSection}
          onDelete={handleDeleteSection}
          onReorder={handleReorder}
          expandedSections={expandedSections}
          onToggleExpand={toggleExpand}
        />
      ) : (
        <SkeletonLoader />
      )}
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