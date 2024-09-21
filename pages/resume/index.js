import React from 'react';
import Profile from '@/components/resume/profile/Profile';
import UserInfoForm from '@/components/resume/userInfo/UserInfoForm';
import DraggableList from '@/components/common/DraggableList';
import { useSections } from '@/hooks/useSections';
import { useResumeActions } from '@/hooks/useResumeActions';
import { resumeStyles } from '@/styles/constLayout';

const Resume = () => {
  const { sections, onSectionDragEnd } = useSections();
  const { handleReset, handlePreview } = useResumeActions();

  const container = `container max-w-myr mx-auto px-12 py-16 flex flex-col justify-center gap-8 bg-white`
  return (
    // <div className={resumeStyles.container}>
    <div className={container}>
      <Profile />
      <UserInfoForm />
      <DraggableList
        items={sections}
        onDragEnd={onSectionDragEnd}
        renderItem={(section) => (
          <div className="section-container" key={section.id}>
            {section.component}
          </div>
        )}
      />

      <div className={resumeStyles.buttonContainer}>
        <button onClick={handlePreview} className={resumeStyles.previewButton}>미리보기</button>
        <button onClick={handleReset} className={resumeStyles.resetButton}>서식 초기화</button>
      </div>
    </div>
  );
};

export default Resume;
