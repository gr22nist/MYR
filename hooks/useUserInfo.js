import { useEffect, useCallback } from 'react';
import useUserInfoStore from '@/store/userInfoStore';
import { typeToKorean } from '@/constants/resumeConstants';

const useUserInfo = () => {
  const { 
    items, 
    status, 
    error, 
    loaduserInfo, 
    saveuserInfo, 
    updateItem, 
    removeItem 
  } = useUserInfoStore();

  const loadUserInfoData = useCallback(() => {
    loaduserInfo();
  }, [loaduserInfo]);

  useEffect(() => {
    loadUserInfoData();
  }, [loadUserInfoData]);

  // 기존의 retryLoading 함수 유지
  const retryLoading = useCallback(() => {
    loadUserInfoData();
  }, [loadUserInfoData]);

  const handleFieldChange = (field, value, itemId = null) => {
    if (itemId) {
      const existingItem = items.find(item => item.id === itemId);
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          value: field === 'custom' ? value.value : value,
          displayType: field === 'custom' ? value.title : typeToKorean[field]
        };
        updateItem(updatedItem);
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
      saveuserInfo(newItem);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
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
