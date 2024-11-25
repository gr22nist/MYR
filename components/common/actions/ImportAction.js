import React, { useState } from 'react';
import ModalComponent from '@/components/common/ModalComponent';
import useGlobalStore from '@/store/globalStore';
import { ImportBtn } from '@/components/icons/IconSet';

const ImportAction = ({ onImport, dataType }) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { showToast } = useGlobalStore();

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        await onImport(importedData);
        setIsImportModalOpen(false);
        showToast({ message: `${dataType} 데이터를 성공적으로 가져왔습니다.`, type: 'success' });
      } catch (error) {
        console.error('파일 파싱 중 오류 발생:', error);
        showToast({ message: '올바른 JSON 파일이 아닙니다. 다시 시도해 주세요.', type: 'error' });
      }
    };

    reader.readAsText(file);
  };

  return (
    <>
      <button onClick={() => setIsImportModalOpen(true)} className='action-btn'>
        <ImportBtn className='btn-icon' />
        <span>가져오기</span>
      </button>
      <ModalComponent isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
        <h2 className='text-xl font-bold mb-4'>{dataType} 데이터 가져오기</h2>
        <p className='mb-4'>내보내기 한 JSON 파일을 선택하여<br />{dataType} 데이터를 가져올 수 있습니다.</p>
        <input
          type='file'
          accept='.json'
          onChange={handleImport}
          className='block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-secondary-dark file:text-white
            hover:file:bg-primary-light file:duration-300 file:ease-in-out'
        />
      </ModalComponent>
    </>
  );
};

export default ImportAction;
