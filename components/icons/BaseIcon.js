// components/icons/BaseIcon.js
import React from 'react';

const Icon = ({
  title,
  fill = 'currentColor',
  width = '24',
  height = '24',
  className = '',
  viewBox = '0 0 24 24',
  children,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    width={width}
    height={height}
    viewBox={viewBox}
    className={className}
    {...props}
  >
    {title && <title>{title}</title>}
    {children}
  </svg>
);

export default Icon;
