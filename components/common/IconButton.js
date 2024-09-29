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

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }} 
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <Icon className={`hover:${hoverFill} hover:scale-110 duration-300`} />
    </button>
  );
};

export default IconButton;
