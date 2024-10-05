import React from 'react';

const TagButtons = ({ tags, activeTag, onTagClick, disabledTags = [] }) => {
  return (
    <div className="tags-container flex flex-row flex-wrap gap-2 font-bold lg:text-sm text-xs">
      <span className='tag px-3 py-2 text-mono-99'>추천태그: </span>
      {tags.map(({ type, label }) => {
        const isDisabled = disabledTags.includes(type);
        return (
          <button 
            key={type}
            onClick={() => !isDisabled && onTagClick(type)}
            className={`tag px-3 py-2 rounded-md transition-colors ${
              isDisabled ? 'bg-transparent border text-mono-cc cursor-not-allowed' :
              activeTag === type ? 'bg-blue-500 text-white' : 'bg-mono-dd text-mono-33 hover:bg-primary-light hover:text-white duration-300'
            }`}
            disabled={isDisabled}
          >
            #{label}
          </button>
        );
      })}
    </div>
  );
};

export default TagButtons;
