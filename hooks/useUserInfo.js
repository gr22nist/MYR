import { useEffect, useCallback } from 'react';
import useUserInfoStore from '@/store/userInfoStore';
import { typeToKorean } from '@/constants/resumeConstants';

const useUserInfo = () => {
  const { 
    items, 
    status, 
    error, 
    loadUserInfo,
    addUserInfo,
    updateUserInfo,
    removeUserInfo,
    reorderUserInfo,
    resetUserInfo,
    exportUserInfo
  } = useUserInfoStore();

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  const handleFieldChange = useCallback((field, value, itemId = null) => {
    const newItem = {
      type: field,
      value: field === 'custom' ? { title: value.title, value: value.value } : value,
      displayType: field === 'custom' ? value.title : typeToKorean[field]
    };

    if (itemId) {
      updateUserInfo({ ...newItem, id: itemId });
    } else {
      if (field !== 'custom' && items.some(item => item.type === field)) {
        alert(`${typeToKorean[field]}은(는) 이미 존재합니다.`);
        return;
      }
      addUserInfo(newItem);
    }
  }, [items, addUserInfo, updateUserInfo]);

  return { 
    items, 
    status, 
    error, 
    handleFieldChange, 
    handleRemoveItem: removeUserInfo,
    reorderUserInfo,
    retryLoading: loadUserInfo,
    resetUserInfo,
    exportUserInfo
  };
};

export default useUserInfo;