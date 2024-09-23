import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import CareerItem from './CareerItem';
import AccordionSection from '../../common/AccordionSection';
import { addCareer, updateCareer, deleteCareer, loadCareers, saveCareers } from '@/redux/slices/careerSlice';
import { AddBtn } from '@/components/icons/IconSet';
import { useTransitionClasses } from '@/hooks/useTransitionClasses';

const CareerList = () => {
  const careers = useSelector(state => state.careers.items);
  const status = useSelector(state => state.careers.status);
  const dispatch = useDispatch();
  const nodeRefs = useRef(new Map());

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCareers());
    }
  }, [dispatch, status]);

  const handleCareerChange = useCallback((updatedCareer) => {
    dispatch(updateCareer(updatedCareer));
    dispatch(saveCareers(careers.map(career => career.id === updatedCareer.id ? updatedCareer : career)));
  }, [dispatch, careers]);

  const handleAddCareer = useCallback(() => {
    const newId = `career-${Date.now()}`;
    const newCareer = { 
      id: newId, 
      companyName: '', 
      position: '', 
      startDate: '', 
      endDate: '', 
      isCurrent: false, 
      tasks: '' 
    };
    dispatch(addCareer(newCareer));
    dispatch(saveCareers([...careers, newCareer]));
  }, [dispatch, careers]);

  const handleDeleteCareer = useCallback((id) => {
    if (careers.length > 1) {
      dispatch(deleteCareer(id));
      const updatedCareers = careers.filter(career => career.id !== id);
      dispatch(saveCareers(updatedCareers));
    }
  }, [dispatch, careers]);

  const addButton = (
    <button
      className="p-1 rounded-full"
      onClick={handleAddCareer}
      aria-label="경력 추가"
    >
      <AddBtn className="w-5 h-5 fill-mono-99 hover:fill-secondary-dark hover:scale-110 duration-300" />
    </button>
  );

  const { classNames } = useTransitionClasses();

  return (
    <AccordionSection title="경력" addButtonComponent={addButton}>
      <TransitionGroup className="space-y-4">
        {careers.map((career) => {
          if (!nodeRefs.current.has(career.id)) {
            nodeRefs.current.set(career.id, React.createRef());
          }
          return (
            <CSSTransition
              key={career.id}
              nodeRef={nodeRefs.current.get(career.id)}
              timeout={300}
              classNames={classNames}
            >
              <div ref={nodeRefs.current.get(career.id)}>
                <CareerItem
                  career={career}
                  onCareerChange={handleCareerChange}
                  onDelete={handleDeleteCareer}
                  isDeletable={careers.length > 1}
                  className=""
                />
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </AccordionSection>
  );
};

export default CareerList;