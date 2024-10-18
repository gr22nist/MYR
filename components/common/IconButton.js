import React from 'react';

const IconButton = ({ 
  icon: Icon, 
  onClick, 
  className = '', 
  hoverFill = '',
  size = 'medium',
  ...props 
}) => {
  const sizeClasses = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3'
  };

  return (
    <span 
      className={`block hover: rounded-full ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <Icon className={`hover:${hoverFill} hover:scale-110 duration-300`} />
    </span>
  );
};

export default IconButton;
