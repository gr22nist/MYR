// 공통 스타일
export const common = {
  baseLayout: 'container max-w-myr mx-auto',
  inputBase: 'w-full p-4 transition-colors duration-300 lg:text-sm text-xs rounded-lg',
  focusStyle: 'focus:border-1 focus:border-mono-cc focus:ring-0 focus:outline-none',
  placeholderStyle: '[&::placeholder]:whitespace-pre-wrap [&::placeholder]:leading-normal [&::placeholder]:text-mono-99',
  flexCenter: 'flex items-center justify-center',
};

// 유틸리티 함수
export const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

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
  container: combineClasses(common.baseLayout, 'px-12 py-16 pb-20 flex flex-col gap-4 justify-center bg-white relative'),
};

// 버튼 스타일
export const btn = {
  base: 'container max-w-default mx-auto',
  common: combineClasses('flex bg-mono-99 text-white px-4 py-2 rounded w-full group relative overflow-hidden', common.textSm),
  preview: 'hover:bg-blue-500',
  reset: 'hover:bg-red-500',
  fold: 'hover:bg-green-500',
  icon: 'group-hover:opacity-0 transition-opacity duration-300',
  text: combineClasses('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300', common.flexCenter, common.textSm),
};

// 라디오 버튼 스타일
export const radio = {
  label: 'flex items-center cursor-pointer select-none',
  input: 'absolute opacity-0 cursor-pointer',
  text: 'relative pl-6',
  textBefore: `
    content-[''] absolute left-0 top-1/2 -translate-y-1/2
    w-[18px] h-[18px] border-2 border-mono-cc rounded-full bg-white
    transition-all duration-300 ease-in-out
  `,
  textAfter: `
    content-[''] absolute left-[6px] top-1/2 -translate-y-1/2
    w-[6px] h-[6px] rounded-full bg-white
  `,
  inputCheckedBefore: 'border-blue-500 bg-blue-500',
};

// 스켈레톤 로딩 스타일
export const skeleton = {
  container: common.baseLayout,
  base: 'mb-5 rounded animate-skeleton bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
  profile: 'h-[200px]',
  userInfo: 'h-[100px]',
  section: 'h-[150px]',
};

// 플로팅 라벨 스타일
const floatingLabelCommon = {
  container: 'relative',
  baseInput: (isFocused, value, isCore, isTitle) => combineClasses(
    common.focusStyle,
    common.inputBase,
    isFocused 
      ? (value ? 'bg-blue-50' : (isCore ? 'bg-pink-50' : 'bg-blue-50'))
      : (isCore && !value ? 'bg-pink-50' : 'bg-mono-f5'),
    isCore && !value ? 'border-pink-200' : '',
    isTitle ? 'text-xl font-bold' : ''
  ),
  baseLabel: (isFocused, value, isTitle, position) => combineClasses(
    `absolute ${position} transition-all duration-300`,
    (isFocused || value !== '')
      ? combineClasses(common.textXs, isTitle ? 'text-base font-semibold' : common.textSm, 'top-2') 
      : 'top-7 text-gray-400 opacity-0',
    isTitle ? 'text-gray-900' : 'text-gray-500'
  ),
};

export const floatingLabel = {
  ...floatingLabelCommon,
  input: floatingLabelCommon.baseInput,
  label: (isFocused, value, isTitle) => floatingLabelCommon.baseLabel(isFocused, value, isTitle, 'right-4'),
  textarea: (isFocused, isTitle) => combineClasses(
    floatingLabelCommon.baseInput(isFocused, true, false, isTitle),
    'resize-none'
  ),
  textareaLabel: (isFocused, value, isTitle) => floatingLabelCommon.baseLabel(isFocused, value, isTitle, 'right-2'),
};

// QuickBtns 스타일
export const quickBtns = {
  container: 'bg-mono-cc bg-opacity-75 p-3 rounded-lg shadow-lg',
  toggleBtn: 'mb-2',
  resetBtnText: 'font-bold',
};

// SkeletonLoader 스타일
export const skeletonLoader = {
  container: skeleton.container,
  item: (type) => combineClasses(skeleton.base, skeleton[type]),
};

// DateRangeInput 스타일
export const dateRangeInput = {
  container: 'flex items-center space-x-2',
  input: combineClasses(common.inputBase, common.focusStyle, 'w-24'),
  disabledInput: 'opacity-50',
  label: 'flex items-center whitespace-nowrap',
  checkbox: 'form-checkbox mr-1',
  errorMessage: combineClasses('text-red-500', common.textXs, common.mt4),
};

// Profile 스타일
export const profile = {
  container: 'flex flex-col gap-2',
  titleContainer: 'relative w-full flex flex-row justify-between items-center gap-4',
  textAreaBase: combineClasses('p-4 bg-mono-f5 leading-normal text-mono-11 border-0 rounded-lg overflow-hidden', common.wFull),
  textArea: (isTitle) => combineClasses(
    profile.textAreaBase,
    common.focusStyle,
    'resize-none',
    isTitle ? 'lg:text-4xl text-3xl font-extrabold h-36 flex-grow' : 'text-lg h-auto'
  ),
};

// CareerItem 및 EducationItem 공통 스타일
export const resumeItem = {
  container: 'my-4 relative flex flex-col gap-2',
  header: 'flex items-center justify-between',
  inputContainer: 'flex gap-4 items-center',
  labelContainer: 'w-label',
};

// EducationItem 추가 스타일
export const educationItem = {
  ...resumeItem,
  radioGroup: combineClasses('flex items-center space-x-2 mt-2', common.textSm),
};

// CustomInput 스타일
export const customInput = {
  container: common.mt4,
  button: combineClasses(common.mt4, common.wFull),
};

// NavBar 스타일
export const navBar = {
  container: 'w-full fixed bg-white z-50 shadow-md opacity-90',
  navWrap: combineClasses(common.baseLayout, 'flex justify-between py-4 items-center'),
  navList: 'flex gap-6 font-extrabold text-lg text-mono-11',
  navItem: 'hover:text-primary-light duration-300',
  logo: 'fill-mono-33 hover:fill-primary-light',
};