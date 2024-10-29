import React from 'react';

const TagButtons = ({ tags, activeTag, onTagClick, disabledTags = [] }) => {
  return (
    <div className='tags-container'>
      <span className='tags-text'>추천태그: </span>
      {tags.map(({ type, label }) => {
        const isDisabled = disabledTags.includes(type);
        return (
          <button 
            key={type}
            onClick={() => !isDisabled && onTagClick(type)}
            className={`tags-btn  ${
              isDisabled ? 'disable-btn' :
              activeTag === type ? '' : 'btn-inactive btn-hover'
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
