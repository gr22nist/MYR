// resume styles
export const resumeStyles = {
  buttonContainer: 'fixed bottom-0 p-4',
  resetButton: 'bg-red-500 text-white px-4 py-2 rounded mr-2',
  previewButton: 'bg-blue-500 text-white px-4 py-2 rounded'
};

// resume > profile 
const textAreaBase = 'p-4 bg-mono-f5 leading-normal text-mono-11 resize-none border-0 rounded-lg overflow-hidden';
const focusStyle = 'focus:border-1 focus:border-mono-cc focus:ring-0 focus:outline-none';

export const profileStyles = {
  textAreaBase,
  focusStyle,
  textAreaStyle: `${textAreaBase} ${focusStyle}`,
  profileTop: 'relative w-full flex flex-row justify-between items-center gap-4',
  placeholderStyle: '[&::placeholder]:whitespace-pre-wrap [&::placeholder]:leading-normal [&::placeholder]:text-mono-99'
};


