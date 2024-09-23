import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loaduserInfo, saveuserInfo, removeItem, updateItem } from '@/redux/slices/userInfoSlice';
import { typeToKorean } from '@/constants/userInfoConstants';

const useUserInfo = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.userInfo);

  const loadUserInfoData = useCallback(() => {
    dispatch(loaduserInfo());
  }, [dispatch]);

  useEffect(() => {
    loadUserInfoData();
  }, [loadUserInfoData]);

  // 새로 추가된 retryLoading 함수
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
        dispatch(updateItem(updatedItem));
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
      dispatch(saveuserInfo(newItem));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  return { 
    items, 
    status, 
    error, 
    handleFieldChange, 
    handleRemoveItem, 
    retryLoading  // 새로 추가된 retryLoading 함수를 반환
  };
};

export default useUserInfo;
