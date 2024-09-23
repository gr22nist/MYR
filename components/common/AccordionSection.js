import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EditBtnSm, DragHandler } from '@/components/icons/IconSet';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const AccordionSection = ({ title, addButtonComponent, children }) => {
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
    // 컨텐츠가 변경될 때마다 높이를 업데이트합니다.
    updateHeight();
  }, [children, updateHeight]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className={`accordion-section ${isExpanded ? '' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className={`flex items-center justify-between p-2 ${isExpanded ? '' : 'h-16'}`}>
        <div className="flex items-center">
          <h2 className="text-xl font-extrabold mr-2">{title}</h2>
          {isExpanded && addButtonComponent}
        </div>
        <div className="flex items-center">
          <button
            className="p-1 rounded-full mr-2"
            onClick={toggleExpand}
            aria-label={isExpanded ? `${title} 접기` : `${title} 펼치기`}
          >
            <EditBtnSm className={`w-5 h-5 fill-mono-99 hover:fill-secondary-dark hover:scale-110 duration-300 transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          <div className="cursor-grab active:cursor-grabbing">
            <DragHandler className="w-5 h-5" />
          </div>
        </div>
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
