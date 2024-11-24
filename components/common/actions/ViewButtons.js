import Link from 'next/link';
import { FoldAllBtn, ExpandAllBtn, ViewBtn } from '@/components/icons/IconSet';

const ViewButtons = ({ onToggleAllSections, areAllSectionsExpanded }) => {
  return (
    <div className='view-btns'>
      <button onClick={onToggleAllSections} className='action-btn'>
        {areAllSectionsExpanded ? 
          <FoldAllBtn className='btn-icon' /> : 
          <ExpandAllBtn className='btn-icon' />
        }
        <span>{areAllSectionsExpanded ? '모두 접기' : '모두 펴기'}</span>
      </button>
      <Link href='/resume/preview' className='action-btn'>
        <ViewBtn className='btn-icon' />
        <span>미리보기</span>
      </Link>
    </div>
  );
};

export default ViewButtons;
  