import React from 'react';
import Link from 'next/link';
import { ResetBtn, FoldAllBtn, ExpandAllBtn, ViewBtn } from '@/components/icons/IconSet';

const QuickBtns = ({ onReset, onToggleAllSections, areAllSectionsExpanded }) => {
  return (
    <div className={'container flex'}>
      <button 
        onClick={onToggleAllSections} 
        className={'btn-common'}
      >
        {areAllSectionsExpanded ? 
          <FoldAllBtn className={'btn-icon'} /> : 
          <ExpandAllBtn className={'btn-icon'} />
        }
        <span className={'btn-text'}>
          {areAllSectionsExpanded ? '모두 접음' : '모두 펼침'}
        </span>
      </button>
      <button 
        onClick={onReset} 
        className={'btn-common'}
      >
        <ResetBtn className={'btn-icon'} />
        <span className={'btn-text'}>
          초기화
        </span>
      </button>
      <Link href="/resume/preview" legacyBehavior>
        <a className={'btn-common'} target="_blank" rel="noopener noreferrer">
          <ViewBtn className={'btn-icon'} />
          <span className={'btn-text'}>
            미리보기
          </span>
        </a>
      </Link>
    </div>
  );
};

export default QuickBtns;
