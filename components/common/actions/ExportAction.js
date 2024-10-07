import React from 'react';

const ExportAction = ({ onExport, dataType }) => {
  const handleExport = async () => {
    try {
      console.log('내보내기 시작');
      const exportData = await onExport();
      const dataStr = JSON.stringify(exportData);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `${dataType}_${new Date().toISOString()}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('내보내기 중 오류 발생:', error);
      alert('내보내기에 실패했습니다.');
    }
  };

  return (
    <button onClick={handleExport} className="px-4 py-2 text-sm bg-mono-99 text-white rounded-lg hover:bg-primary-light duration-300">
      내보내기
    </button>
  );
};

export default ExportAction;
