import React from 'react';
import Link from 'next/link';
import { ResetBtn, FoldAllBtn, ExpandAllBtn, ViewBtn } from '@/components/icons/IconSet';

const QuickBtns = ({ onReset, onToggleAllSections, areAllSectionsExpanded }) => {
  return (
    <div className={'quick-btns-container'}>
      <button onClick={onToggleAllSections} className='quick-btn'>
        {areAllSectionsExpanded ? <FoldAllBtn className='btn-icon' /> : <ExpandAllBtn className='btn-icon' />}
        <span className='text-sm'>
          {areAllSectionsExpanded ? '모두 접기' : '모두 펴기'}
        </span>
      </button>
      <button onClick={onReset} className='quick-btn'>
        <ResetBtn className='btn-icon' />
        <span className='text-sm'>
          초기화
        </span>
      </button>
      <Link href="/resume/preview" legacyBehavior>
        <a className='quick-btn'>
          <ViewBtn className='btn-icon' />
          <span className='text-sm'>
            미리보기
          </span>
        </a>
      </Link>
    </div>
  );
};

export default QuickBtns;
