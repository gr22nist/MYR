import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AutoSaveIndicator from '@/components/common/AutoSaveIndicator';
import ViewButtons from './ViewButtons';
import DataManageButtons from './DataManageButtons';

const TopActions = ({ onExport, onImport, onReset, onToggleAllSections, areAllSectionsExpanded, dataType }) => {
  return (
    <TooltipProvider>
      <div className='top-actions'>
        <div className='top-actions-group'>
          {/* 왼쪽: 상태 표시 */}
          <div className="flex-none">
            <AutoSaveIndicator />
          </div>
          
          {/* 중앙/오른쪽: 액션 버튼들 */}
          <div className="flex items-center gap-2">
            <ViewButtons 
              onToggleAllSections={onToggleAllSections}
              areAllSectionsExpanded={areAllSectionsExpanded}
            />
            <DataManageButtons 
              onExport={onExport}
              onImport={onImport}
              onReset={onReset}
              dataType={dataType}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TopActions;
