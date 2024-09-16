import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Profile from '@/components/resume/profile/Profile';
import PersonalInfoForm from '@/components/resume/personalInfo/PersonalInfoForm';
import CareerList from '@/components/resume/career/CareerList';
import EducationList from '@/components/resume/education/EducationList';
import DraggableList from '@/components/common/DraggableList';
import { resetResume } from '@/redux/slices/resumeSlice';
import { showToast } from '@/redux/slices/globalSlice';
import { useIndexedDB } from '@/hooks/useIndexedDB';

const Resume = () => {
  const dispatch = useDispatch();
  const { deleteItem } = useIndexedDB();

  const profileRef = useRef();
  const personalInfoRef = useRef();
  const careerListRef = useRef();
  const educationListRef = useRef();

  const [sections, setSections] = useState([
    { id: 'career', component: <CareerList ref={careerListRef} /> },
    { id: 'education', component: <EducationList ref={educationListRef} /> },
  ]);

  const onSectionDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, movedSection);
    setSections(reorderedSections);
  };

  const handleSave = async () => {
    try {
      await profileRef.current.handleSave();
      await personalInfoRef.current.handleSave();
      await careerListRef.current.handleSave();
      await educationListRef.current.handleSave();
      dispatch(showToast({ message: '임시 저장되었습니다.', type: 'success' }));
    } catch (error) {
      console.error('Failed to save some data:', error);
      dispatch(showToast({ message: '저장 중 오류가 발생했습니다.', type: 'error' }));
    }
  };

  const handleReset = async () => {
    await deleteItem('resumeData', 'resume');
    dispatch(resetResume());
    dispatch(showToast({ message: '서식이 초기화되었습니다.', type: 'success' }));
  };

  const container = `container max-w-default mx-auto`;

  return (
    <div className={container}>
      <Profile ref={profileRef} />
      <PersonalInfoForm />
      <DraggableList
        items={sections}
        onDragEnd={onSectionDragEnd}
        renderItem={(section, index) => (
          <div className="section-container" key={section.id}>
            {section.component}
          </div>
        )}
      />

      <div className="fixed bottom-0 p-4">
        <button onClick={handleSave} className="bg-green-500">임시 저장</button>
        <button onClick={handleReset} className="bg-red-500">서식 초기화</button>
      </div>
    </div>
  );
};

export default Resume;
