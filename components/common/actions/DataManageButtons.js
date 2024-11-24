import ExportAction from './ExportAction';
import ImportAction from './ImportAction';
import { ResetBtn, FoldAllBtn, ExpandAllBtn, ViewBtn } from '@/components/icons/IconSet';  
import Link from 'next/link';

// 데이터 관리 관련 버튼들 (Export/Import/Reset)
const DataManageButtons = ({ onExport, onImport, onReset, dataType }) => {
  return (
    <div className='data-manage-btns'>
      <ExportAction onExport={onExport} dataType={dataType} />
      <ImportAction onImport={onImport} dataType={dataType} />
      <button onClick={onReset} className='action-btn danger'>
        <ResetBtn className='btn-icon' />
        <span>초기화</span>
      </button>
    </div>
  );
};

// 보기 관련 버튼들 (모두펴기/접기, 미리보기)
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

export default DataManageButtons;
