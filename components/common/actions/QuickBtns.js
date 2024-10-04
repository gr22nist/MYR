import React from 'react';
import { btn, quickBtns } from '@/styles/constLayout';
import { ResetBtn, FoldAllBtn, ExpandAllBtn } from '@/components/icons/IconSet';

const QuickBtns = ({ onReset, onToggleAllSections, areAllSectionsExpanded }) => {
  return (
    <div className={quickBtns.container}>
      <button 
        onClick={onToggleAllSections} 
        className={`${btn.common} ${btn.fold} ${quickBtns.toggleBtn}`}
      >
        {areAllSectionsExpanded ? 
          <FoldAllBtn className={btn.icon} /> : 
          <ExpandAllBtn className={btn.icon} />
        }
        <span className={btn.text}>
          {areAllSectionsExpanded ? '모두 접음' : '모두 펼침'}
        </span>
      </button>
      <button 
        onClick={onReset} 
        className={`${btn.common} ${btn.reset}`}
      >
        <ResetBtn className={btn.icon} />
        <span className={`${btn.text} ${quickBtns.resetBtnText}`}>
          초기화
        </span>
      </button>
    </div>
  );
};

export default QuickBtns;
