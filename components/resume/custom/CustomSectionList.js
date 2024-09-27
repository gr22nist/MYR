import React, { useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import CustomSectionInput from './CustomSectionInput';
import { useTransitionClasses } from '@/hooks/useTransitionClasses';
import useCustomStore from '@/store/customStore';

const CustomSectionList = () => {
  const { sections, updateCustomSection, removeCustomSection } = useCustomStore();
  const nodeRefs = useRef(new Map());
  const { classNames } = useTransitionClasses();

  return (
    <TransitionGroup className="space-y-4 mt-4">
      {Array.isArray(sections) && sections.map((section) => {
        if (!nodeRefs.current.has(section.id)) {
          nodeRefs.current.set(section.id, React.createRef());
        }
        return (
          <CSSTransition
            key={section.id}
            nodeRef={nodeRefs.current.get(section.id)}
            timeout={300}
            classNames={classNames}
          >
            <div ref={nodeRefs.current.get(section.id)}>
              <CustomSectionInput
                type={section.type}
                section={section}
                onSectionChange={updateCustomSection}
                onDelete={removeCustomSection}
                isDeletable={true}
                dragHandleProps={{}}
                className=""
              />
            </div>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

export default CustomSectionList;
