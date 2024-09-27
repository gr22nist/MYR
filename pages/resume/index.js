import React, { useState, useEffect } from 'react';
import { layout } from '@/styles/constLayout';
import Profile from '@/components/resume/profile/Profile';
import UserInfoForm from '@/components/resume/userInfo/UserInfoForm';
import { useResumeActions } from '@/hooks/useResumeActions';
import ModalComponent from '@/components/resume/userInfo/ModalComponent';
import FloatingControls from '@/components/common/actions/FloatingControls';
import DraggableList from '@/components/common/DraggableList';
import useResumeSectionsStore from '@/store/resumeSectionsStore';
import useUserInfoStore from '@/store/userInfoStore';
import CareerList from '@/components/resume/career/CareerList';
import EducationList from '@/components/resume/education/EducationList';
import CustomForm from '@/components/resume/custom/CustomForm';

const Resume = () => {
  const { sections, setSections, updateSection, removeSection, reorderSections } = useResumeSectionsStore();
  // resetUserInfo 제거
  const { handleReset, handlePreview } = useResumeActions();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    // 여기서 초기 섹션 데이터를 로드합니다.
    if (sections.length === 0) {
      const initialSections = [
        { id: 'career', type: 'career' },
        { id: 'education', type: 'education' },
        // 커스텀 섹션은 여러 개일 수 있습니다
      ];
      setSections(initialSections);
    }
  }, [sections, setSections]);

  const handleResetClick = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = async () => {
    setIsResetModalOpen(false);
    const resetSuccess = await handleReset();
    if (resetSuccess) {
      console.log('초기화 성공, 새로고침 실행');
      window.location.reload();
    } else {
      console.log('초기화 실패');
    }
  };

  const renderSection = (section) => {
    switch (section.type) {
      case 'career':
        return <CareerList />;
      case 'education':
        return <EducationList />;
      case 'custom':
        return (
          <CustomForm
            section={section}
            onSectionChange={(updatedSection) => updateSection(updatedSection)}
            onDelete={() => removeSection(section.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${layout.container} pb-20 sm:pb-0`}>
      <Profile />
      <UserInfoForm />
      <DraggableList
        items={sections}
        onDragEnd={reorderSections}
        renderItem={renderSection}
      />

      <FloatingControls onPreview={handlePreview} onReset={handleResetClick} />

      <ModalComponent isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)}>
        <p>정말로 모든 데이터를 초기화하시겠습니까?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsResetModalOpen(false)}>취소</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleConfirmReset}>초기화</button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default Resume;