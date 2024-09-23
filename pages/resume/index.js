import React, { useState } from 'react';
import Profile from '@/components/resume/profile/Profile';
import UserInfoForm from '@/components/resume/userInfo/UserInfoForm';
import { useSections } from '@/hooks/useSections';
import { useResumeActions } from '@/hooks/useResumeActions';
import ModalComponent from '@/components/resume/userInfo/ModalComponent';
import { layout } from '@/styles/constLayout';

const Resume = () => {
  const { sections, onSectionDragEnd } = useSections();
  const { handleReset, handlePreview } = useResumeActions();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleResetClick = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    handleReset();
    setIsResetModalOpen(false);
  };

  return (
    <div className={layout.container}>
      <Profile />
      <UserInfoForm />
      <div className="space-y-4"> {/* 여기에 간격 추가 */}
        {sections.map((section) => (
          <div className="section-container" key={section.id}>
            {section.component}
          </div>
        ))}
      </div>

      <div className={layout.buttonContainer}>
        <button onClick={handlePreview} className={layout.previewButton}>미리보기</button>
        <button onClick={handleResetClick} className={layout.resetButton}>서식 초기화</button>
      </div>

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
