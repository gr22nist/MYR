import React, { useState, useRef, useEffect, useCallback } from 'react';
import ActionButtons from './actions/ActionBtns';

const AccordionSection = ({ title, addButtonComponent, children, dragHandleProps }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const contentRef = useRef(null);
  const observerRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      if (isExpanded) {
        contentRef.current.style.maxHeight = 'none';
        const height = contentRef.current.scrollHeight;
        contentRef.current.style.maxHeight = `${height}px`;
      } else {
        contentRef.current.style.maxHeight = '0px';
      }
    }
  }, [isExpanded]);

  useEffect(() => {
    updateHeight();

    observerRef.current = new ResizeObserver(() => {
      if (isExpanded) {
        updateHeight();
      }
    });

    if (contentRef.current) {
      observerRef.current.observe(contentRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [updateHeight, isExpanded]);

  useEffect(() => {
    updateHeight();
  }, [children, updateHeight]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className={`accordion-section ${isExpanded ? '' : 'bg-mono-f5 hover:bg-accent-dark hover:text-white duration-300'} transition-colors duration-300 rounded-lg`}>
      <div className={`flex items-center justify-between p-2 ${isExpanded ? '' : 'h-16'}`}>
        <div className="flex items-center">
          <h2 className="text-xl font-extrabold mr-2">{title}</h2>
          {isExpanded && addButtonComponent}
        </div>
        <ActionButtons
          onFold={toggleExpand}
          isExpanded={isExpanded}
          dragHandleProps={dragHandleProps}
          mode="section"
        />
      </div>
      <div 
        ref={contentRef}
        className="overflow-hidden transition-all duration-400 ease-in-out"
      >
        {children}
      </div>
    </section>
  );
};

export default AccordionSection;
