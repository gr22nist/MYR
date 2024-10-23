import React from 'react';
import AutoSaveIndicator from '@/components/common/AutoSaveIndicator';
import ExportAction from './ExportAction';
import ImportAction from './ImportAction';

const DataActions = ({ onExport, onImport, dataType }) => {
  return (
    <div className='data-container'>
      <AutoSaveIndicator />
      <div className='data-btns'>
        <ExportAction onExport={onExport} dataType={dataType} />
        <ImportAction onImport={onImport} dataType={dataType} />
      </div>
    </div>
  );
};

export default DataActions;
