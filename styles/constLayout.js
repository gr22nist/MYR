// 공통 스타일
export const commonStyles = {
  inputBase: 'text-sm rounded-lg px-2',
  focusStyle: 'focus:border-1 focus:border-mono-cc focus:ring-0 focus:outline-none',
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
  container: 'container max-w-myr mx-auto px-12 py-16 flex flex-col gap-4 justify-center bg-white',
  previewButton: 'flex bg-blue-500 text-white p-4 rounded',
  resetButton: 'flex  bg-red-500 text-white p-4 rounded',
};


export const btn = {
  base: '',
  preview: 'flex bg-blue-500 text-white px-4 py-2 rounded',
  reset: 'flex  bg-red-500 text-white px-4 py-2 rounded',
};