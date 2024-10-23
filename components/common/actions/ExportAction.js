import React from 'react';
import useGlobalStore from '@/store/globalStore';

const ExportAction = ({ onExport, dataType }) => {
  const { showToast } = useGlobalStore();

  const handleExport = async () => {
    try {
      const exportData = await onExport();
      const dataStr = JSON.stringify(exportData);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `${dataType}_${new Date().toISOString()}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showToast({ message: `${dataType} 데이터를 성공적으로 내보냈습니다.`, type: 'success' });
    } catch (error) {
      console.error('내보내기 중 오류 발생:', error);
      showToast({ message: '내보내기에 실패했습니다.', type: 'error' });
    }
  };

  return (
    <button onClick={handleExport} className="export-btn">
      내보내기
    </button>
  );
};

export default ExportAction;
