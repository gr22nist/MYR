import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon: Icon, // 아이콘 컴포넌트를 prop으로 받습니다
  iconPosition = 'left', // 아이콘 위치를 지정할 수 있습니다
  disabled = false, 
  onClick, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-bold rounded-lg transition-colors duration-300 flex items-center';
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? disabledClasses : ''}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="mr-2" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="ml-2" />}
    </button>
  );
};

export default Button;
