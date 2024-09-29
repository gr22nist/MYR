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
    removeUserInfo 
  } = useUserInfoStore();

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  const retryLoading = useCallback(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  const handleFieldChange = (field, value, itemId = null) => {
    if (itemId) {
      const existingItem = items.find(item => item.id === itemId);
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          value: field === 'custom' ? value.value : value,
          displayType: field === 'custom' ? value.title : typeToKorean[field]
        };
        updateUserInfo(updatedItem);
      }
    } else {
      if (field !== 'custom' && items.some(item => item.type === field)) {
        alert(`${typeToKorean[field]}은(는) 이미 존재합니다.`);
        return;
      }
      const newItem = {
        type: field,
        value: field === 'custom' ? value.value : value,
        displayType: field === 'custom' ? value.title : typeToKorean[field]
      };
      addUserInfo(newItem);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeUserInfo(itemId);
  };

  return { 
    items, 
    status, 
    error, 
    handleFieldChange, 
    handleRemoveItem, 
    retryLoading
  };
};

export default useUserInfo;
