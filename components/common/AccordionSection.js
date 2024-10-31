import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ActionButtons from './actions/ActionBtns';

const AccordionSection = ({ title, addButtonComponent, children, isExpanded, onToggle, dragHandleProps, mode, onDelete, isCustomTitle }) => {
  const contentRef = useRef(null);

  const toggleExpand = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <section className={`accordion-container ${isExpanded ? '' : 'bg-mono-f5'}`}>
      <div className='accordion' {...(!isExpanded ? dragHandleProps : {})}>
        <div className={`flex items-center ${isCustomTitle ? '' : 'pl-6'}`}>
          {title && <h2 className={`text-xl font-bold truncate ${isCustomTitle ? 'py-1' : 'py-6'}`}>{title}</h2>}
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
          className='overflow-hidden animation'
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
  isCustomTitle: PropTypes.bool,
};

export default AccordionSection;
