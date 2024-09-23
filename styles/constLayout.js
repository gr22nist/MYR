// 공통 스타일
export const commonStyles = {
  inputBase: 'text-sm rounded-lg px-2',
  focusStyle: 'focus:border-1 focus:border-mono-cc focus:ring-0 focus:outline-none',
  inputBase: 'text-sm rounded-lg px-2',
  placeholderStyle: '[&::placeholder]:whitespace-pre-wrap [&::placeholder]:leading-normal [&::placeholder]:text-mono-99'
};

// 유틸리티 함수
export const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

// 동적 스타일링을 위한 헬퍼 함수
export const getColorClass = (color, type = 'text') => {
  const colorMap = {
    primary: 'blue',
    secondary: 'green',
    danger: 'red',
  };
  return `${type}-${colorMap[color] || color}-500`;
};

// 레이아웃 관련 상수
export const layout = {
  mainContentWidth: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
};

