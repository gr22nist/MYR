import React from 'react';
import Link from 'next/link';
import { BackBtn, PrintBtn } from '@/components/icons/IconSet';

const PreviewActions = ({ onPrint }) => {
  return (
    <div className='top-actions print:hidden'>
      <div className='top-actions-group'>
        <div className='preview-btns-left'>
          <Link href='/resume' className='action-btn'>
            {/* <BackBtn className='btn-icon' /> */}
            <span>돌아가기</span>
          </Link>
        </div>
        <div className='preview-btns-right'>
          <button onClick={onPrint} className='action-btn'>
            {/* <PrintBtn className='btn-icon' /> */}
            <span>인쇄하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewActions;