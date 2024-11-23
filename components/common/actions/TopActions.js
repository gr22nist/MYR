import React from 'react';
import AutoSaveIndicator from '@/components/common/AutoSaveIndicator';
import ExportAction from './ExportAction';
import ImportAction from './ImportAction';
import QuickBtns from './QuickBtns';

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
        <div className='top-actions-left'>
          <AutoSaveIndicator />
          <div className='data-btns'>
            <ExportAction onExport={onExport} dataType={dataType} />
            <ImportAction onImport={onImport} dataType={dataType} />
          </div>
        </div>
        <div className='top-actions-right'>
          <QuickBtns 
            onReset={onReset}
            onToggleAllSections={onToggleAllSections}
            areAllSectionsExpanded={areAllSectionsExpanded}
          />
        </div>
      </div>
    </div>
  );
};

export default TopActions;
