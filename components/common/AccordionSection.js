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
    <section className={`accordion-section ${isExpanded ? '' : 'bg-mono-f5'} transition-all duration-300 rounded-lg`}>
      <div className="flex items-center justify-between p-2 h-16" {...(!isExpanded ? dragHandleProps : {})}>
        <div className="flex items-center overflow-hidden">
          <h2 className="text-xl font-bold mr-2 truncate">{title}</h2>
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
