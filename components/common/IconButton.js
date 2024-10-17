import React from 'react';

const IconButton = ({ 
  icon: Icon, 
  onClick, 
  className = '', 
  hoverFill = 'fill-secondary-dark',
  size = 'medium',
  ...props 
}) => {
  const sizeClasses = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3'
  };

  // handleClick 함수 제거

  return (
    <span 
      className={`block bg-slate-200 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <Icon className={`hover:${hoverFill} hover:scale-110 duration-300`} />
    </span>
  );
};

export default IconButton;
