import React from 'react';
import AutoSaveIndicator from '@/components/common/AutoSaveIndicator';
import ExportAction from './ExportAction';
import ImportAction from './ImportAction';

const DataActions = ({ onExport, onImport, dataType }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <ExportAction onExport={onExport} dataType={dataType} />
      <ImportAction onImport={onImport} dataType={dataType} />
      <AutoSaveIndicator />
    </div>
  );
};

export default DataActions;
