import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ActionButtons from './actions/ActionBtns';

const AccordionSection = ({ title, addButtonComponent, children, isExpanded, onToggle, dragHandleProps, mode, onDelete }) => {
  const contentRef = useRef(null);

  const toggleExpand = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <section className={`accordion-section ${isExpanded ? '' : 'bg-mono-f5'} space-y-2 transition-all duration-300 rounded-lg`}>
      <div className="flex items-center justify-between h-16 pr-4" {...(!isExpanded ? dragHandleProps : {})}>
        <div className="flex items-center overflow-hidden">
          {title && <h2 className="text-xl font-bold truncate pl-4">{title}</h2>}
          {isExpanded && addButtonComponent}
        </div>
        <ActionButtons
          onFold={toggleExpand}
          onDelete={onDelete}
          isExpanded={isExpanded}
          mode={mode}
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
  title: PropTypes.node,
  addButtonComponent: PropTypes.node,
  children: PropTypes.node,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
  dragHandleProps: PropTypes.object,
  mode: PropTypes.oneOf(['item', 'section', 'custom']).isRequired,
  onDelete: PropTypes.func,
};

export default AccordionSection;
