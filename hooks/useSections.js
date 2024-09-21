import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadCustomSections, removeCustomSection } from '@/redux/slices/customSectionSlice';
import CareerList from '@/components/resume/career/CareerList';
import EducationList from '@/components/resume/education/EducationList';
import CustomSectionForm from '@/components/resume/custom/CustomForm';
import { reorderSections } from '@/utils/sectionUtils';

export const useSections = () => {
  const dispatch = useDispatch();
  const customSections = useSelector(state => state.customSections.sections);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    dispatch(loadCustomSections());
  }, [dispatch]);

  useEffect(() => {
    const updatedSections = [
      { id: 'career', component: <CareerList /> },
      { id: 'education', component: <EducationList /> },
      { id: 'customForm', component: <CustomSectionForm /> },
      ...customSections.map(section => ({
        id: section.id,
        component: (
          <div key={section.id}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
            <button onClick={() => dispatch(removeCustomSection(section.id))}>삭제</button>
          </div>
        )
      }))
    ];
    setSections(updatedSections);
  }, [customSections, dispatch]);

  const onSectionDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const newSections = reorderSections(
      sections,
      result.source.index,
      result.destination.index
    );
    setSections(newSections);
  }, [sections]);

  return { sections, onSectionDragEnd };
};
