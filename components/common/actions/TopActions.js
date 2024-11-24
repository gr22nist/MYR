import React from 'react';
import AutoSaveIndicator from '@/components/common/AutoSaveIndicator';
import ViewButtons from './ViewButtons';
import DataManageButtons from './DataManageButtons';

const TopActions = ({ 
  onExport, 
  onImport, 
  onReset,
  onToggleAllSections,
  areAllSectionsExpanded,
  dataType 
}) => {
  return (
    <div className='top-actions'>
      <div className='top-actions-group'>
        {/* 왼쪽: 상태 표시 */}
        <AutoSaveIndicator />
        
        {/* 중앙: 보기 관련 버튼 */}
        <ViewButtons 
          onToggleAllSections={onToggleAllSections}
          areAllSectionsExpanded={areAllSectionsExpanded}
        />

        {/* 오른쪽: 데이터 관리 */}
        <DataManageButtons 
          onExport={onExport}
          onImport={onImport}
          onReset={onReset}
          dataType={dataType}
        />
      </div>
    </div>
  );
};

export default TopActions;
