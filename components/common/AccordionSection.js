import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ActionButtons from './actions/ActionBtns';

const AccordionSection = ({ title, addButtonComponent, children, isExpanded: propIsExpanded, onToggle, dragHandleProps, mode, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(propIsExpanded !== undefined ? propIsExpanded : true);
  const contentRef = useRef(null);

  useEffect(() => {
    if (propIsExpanded !== undefined) {
      setIsExpanded(propIsExpanded);
    }
  }, [propIsExpanded]);

  const toggleExpand = () => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    if (onToggle) {
      onToggle(newIsExpanded);
    }
  };

  return (
    <section className={`accordion-section ${isExpanded ? '' : 'bg-mono-f5'} transition-all duration-300 rounded-lg`}>
      <div className="flex items-center justify-between p-2 h-16">
        <div className="flex items-center overflow-hidden">
          <h2 className="text-xl font-extrabold mr-2 truncate">{title}</h2>
          {isExpanded && addButtonComponent}
        </div>
        <ActionButtons
          onFold={toggleExpand}
          onDelete={onDelete}
          isExpanded={isExpanded}
          mode={mode}
          dragHandleProps={!isExpanded ? dragHandleProps : null}
        />
      </div>
      {isExpanded && (
        <div 
          ref={contentRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
        >
          {children}
        </div>
      )}
    </section>
  );
};

AccordionSection.propTypes = {
  title: PropTypes.node.isRequired,
  addButtonComponent: PropTypes.node,
  children: PropTypes.node,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  dragHandleProps: PropTypes.object,
  mode: PropTypes.oneOf(['item', 'section', 'custom']).isRequired,
  onDelete: PropTypes.func,
};

export default AccordionSection;
