import React from 'react';
import Link from 'next/link';
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
      <Link href="/resume/preview" legacyBehavior >
        <a className={`${btn.common} ${btn.preview}`}>
          <span className={btn.text}>
            미리보기
          </span>
        </a>
      </Link>
    </div>
  );
};

export default QuickBtns;
