import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EducationItem from './EducationItem';
import DraggableList from '../../common/DraggableList';
import { addEducation, updateEducation, deleteEducation, loadEducations, saveEducations } from '@/redux/slices/educationSlice';

const EducationList = () => {
  const educations = useSelector(state => state.educations.items);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadEducations());
  }, [dispatch]);

  const handleEducationChange = useCallback((updatedEducation) => {
    dispatch(updateEducation(updatedEducation));
    dispatch(saveEducations(educations.map(edu => edu.id === updatedEducation.id ? updatedEducation : edu)));
  }, [dispatch, educations]);

  const handleAddEducation = useCallback(() => {
    const newEducation = {
      id: `education-${Date.now()}`,
      schoolName: '',
      major: '',
      period: '',
      graduationStatus: '재학중'
    };
    dispatch(addEducation(newEducation));
    dispatch(saveEducations([...educations, newEducation]));
  }, [dispatch, educations]);

  const handleDeleteEducation = useCallback((id) => {
    if (educations.length > 1) {
      dispatch(deleteEducation(id));
      dispatch(saveEducations(educations.filter(edu => edu.id !== id)));
    }
  }, [dispatch, educations]);

  return (
    <div className="education-list">
      <h2 className="text-xl font-bold mb-4">학력</h2>
      <DraggableList
        items={educations}
        renderItem={(education) => (
          <EducationItem
            key={education.id}
            education={education}
            onEducationChange={handleEducationChange}
            onDelete={() => handleDeleteEducation(education.id)}
            isDeletable={educations.length > 1}
          />
        )}
      />
      <div className="mt-4 flex justify-center">
        <button
          className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center"
          onClick={handleAddEducation}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default EducationList;
