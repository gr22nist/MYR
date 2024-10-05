import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Tooltip = ({ children, content, disabled }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const targetRef = useRef(null);

  useEffect(() => {
    if (!content || disabled) {
      setIsVisible(false);
    }
  }, [content, disabled]);

  const updatePosition = () => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const x = rect.left; // 우측 정렬을 위해 right 값 사용
      const y = rect.top - 8; // 툴팁과 요소 사이의 간격
      
      setPosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    if (!content || disabled) return;
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible && content && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div 
          className="fixed z-50 px-3 py-2 lg:text-sm text-xs font-medium text-white bg-primary-light rounded-lg shadow-sm opacity-90"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(0, -100%)', // 우측 정렬을 위해 x축 변환 제거
            pointerEvents: 'none',
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
