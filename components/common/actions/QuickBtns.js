import React from 'react';
import { btn } from '@/styles/constLayout';
import { ResetBtn, FoldAllBtn, ExpandAllBtn } from '@/components/icons/IconSet';

const QuickBtns = ({ onReset, onToggleAllSections, areAllSectionsExpanded }) => {
  return (
    <div className="bg-mono-cc bg-opacity-75 p-3 rounded-lg shadow-lg">
      <button 
        onClick={onToggleAllSections} 
        className={`${btn.fold} mb-2 w-full group relative overflow-hidden`}
      >
        {areAllSectionsExpanded ? <FoldAllBtn className="group-hover:opacity-0 transition-opacity duration-200" /> : <ExpandAllBtn className="group-hover:opacity-0 transition-opacity duration-200" />}
        <span className="absolute inset-0 flex items-center justify-center text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {areAllSectionsExpanded ? '모두 접음' : '모두 펼침'}
        </span>
      </button>
      <button 
        onClick={onReset} 
        className={`${btn.reset} w-full group relative overflow-hidden`}
      >
        <ResetBtn className="group-hover:opacity-0 transition-opacity duration-200" />
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          초기화
        </span>
      </button>
    </div>
  );
};

export default QuickBtns;
