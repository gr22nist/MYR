import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import EducationItem from './EducationItem';
import AccordionSection from '../../common/AccordionSection';
import { addEducation, updateEducation, deleteEducation, loadEducations, saveEducations } from '@/redux/slices/educationSlice';
import { AddBtn } from '@/components/icons/IconSet';
import { useTransitionClasses } from '@/hooks/useTransitionClasses';

const EducationList = () => {
  const educations = useSelector(state => state.educations.items);
  const status = useSelector(state => state.educations.status);
  const dispatch = useDispatch();
  const nodeRefs = useRef(new Map());

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadEducations());
    }
  }, [dispatch, status]);

  const handleEducationChange = useCallback((updatedEducation) => {
    dispatch(updateEducation(updatedEducation));
    dispatch(saveEducations(educations.map(edu => edu.id === updatedEducation.id ? updatedEducation : edu)));
  }, [dispatch, educations]);

  const handleAddEducation = useCallback(() => {
    const newId = `education-${Date.now()}`;
    const newEducation = {
      id: newId,
      schoolName: '',
      major: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      graduationStatus: '재학중'
    };
    dispatch(addEducation(newEducation));
    dispatch(saveEducations([...educations, newEducation]));
  }, [dispatch, educations]);

  const handleDeleteEducation = useCallback((id) => {
    if (educations.length > 1) {
      dispatch(deleteEducation(id));
      const updatedEducations = educations.filter(edu => edu.id !== id);
      dispatch(saveEducations(updatedEducations));
    }
  }, [dispatch, educations]);

  const addButton = (
    <button
      className="p-1 rounded-full"
      onClick={handleAddEducation}
      aria-label="학력 추가"
    >
      <AddBtn className="w-5 h-5 fill-mono-99 hover:fill-secondary-dark hover:scale-110 duration-300" />
    </button>
  );

  const { classNames } = useTransitionClasses();

  return (
    <AccordionSection title="학력" addButtonComponent={addButton}>
      <TransitionGroup className="space-y-4">
        {educations.map((education) => {
          if (!nodeRefs.current.has(education.id)) {
            nodeRefs.current.set(education.id, React.createRef());
          }
          return (
            <CSSTransition
              key={education.id}
              nodeRef={nodeRefs.current.get(education.id)}
              timeout={300}
              classNames={classNames}
            >
              <div ref={nodeRefs.current.get(education.id)}>
                <EducationItem
                  education={education}
                  onEducationChange={handleEducationChange}
                  onDelete={handleDeleteEducation}
                  isDeletable={educations.length > 1}
                />
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </AccordionSection>
  );
};

export default EducationList;
