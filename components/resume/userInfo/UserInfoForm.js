import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { loaduserInfo, saveuserInfo, removeItem, updateItem } from '@/redux/slices/userInfoSlice';
import ModalComponent from './ModalComponent';
import UserInfoItem from './UserInfoItem';
import AddressInput from './inputs/AddressInput';
import BirthDateInput from './inputs/BirthDateInput';
import PhoneInput from './inputs/PhoneInput';
import EmailInput from './inputs/EmailInput';
import SalaryInput from './inputs/SalaryInput';
import CustomFieldInput from './inputs/CustomFieldInput';

const UserInfoForm = ({ containerRef }) => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.userInfo);
  const [activeField, setActiveField] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const loadUserInfoData = useCallback(() => {
    dispatch(loaduserInfo());
  }, [dispatch]);

  useEffect(() => {
    loadUserInfoData();
  }, [loadUserInfoData]);

  if (status === 'loading') return <div>로딩 중...</div>;
  if (status === 'failed') return <div>데이터를 불러오는데 실패했습니다: {error}</div>;
  if (status !== 'succeeded') return null;

  const typeToKorean = {
    address: '거주지역',
    birthDate: '생년월일',
    phone: '연락처',
    email: '이메일',
    salary: '희망연봉',
    custom: '사용자 정의'
  };

  const handleFieldChange = (field, value, itemId = null) => {
    if (itemId) {
      // 기존 항목 수정
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
      // 새 항목 추가
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

    setActiveField(null);
    setIsCustomModalOpen(false);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const fieldComponents = {
    address: <AddressInput onChange={(value) => handleFieldChange('address', value, activeField?.id)} initialValue={activeField?.id ? items.find(item => item.id === activeField.id)?.value : ''} />,
    birthDate: <BirthDateInput onChange={(value) => handleFieldChange('birthDate', value, activeField?.id)} initialValue={activeField?.id ? items.find(item => item.id === activeField.id)?.value : ''} />,
    phone: <PhoneInput onChange={(value) => handleFieldChange('phone', value, activeField?.id)} initialValue={activeField?.id ? items.find(item => item.id === activeField.id)?.value : ''} />,
    email: <EmailInput onChange={(value) => handleFieldChange('email', value, activeField?.id)} initialValue={activeField?.id ? items.find(item => item.id === activeField.id)?.value : ''} />,
    salary: <SalaryInput onChange={(value) => handleFieldChange('salary', value, activeField?.id)} initialValue={activeField?.id ? items.find(item => item.id === activeField.id)?.value : ''} />,
    custom: <CustomFieldInput onChange={(title, value) => handleFieldChange('custom', { title, value }, activeField?.id)} initialValue={activeField?.id ? items.find(item => item.id === activeField.id) : null} />,
  };

  return (
    <div ref={containerRef} className="personal-info flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">개인 정보</h2>
      <div className="flex items-center mb-4">
        <button 
          onClick={() => setIsCustomModalOpen(true)}
          className="add-info-button bg-mono-66 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          <span className="plus-icon">+</span> 개인정보 자유 서식
        </button>
      </div>
      
      <div className="tags-container flex flex-wrap gap-2 mb-4">
        <span className='tag px-3 py-2 rounded-md transition-colors'>추천태그: </span>
        {Object.entries(typeToKorean).filter(([type]) => type !== 'custom').map(([type, label]) => {
          const isDisabled = items.some(item => item.type === type);
          return (
            <button 
              key={type}
              onClick={() => !isDisabled && setActiveField({ type, id: null })}
              className={`tag px-3 py-2 rounded-md transition-colors ${
                isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                activeField?.type === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={isDisabled}
            >
              #{label}
            </button>
          );
        })}
      </div>
      
      <p className="info-message text-sm text-gray-600 mb-4">
        꼭 필요한 개인정보가 있는 경우에 작성해주세요. 추가 된 항목이 없으면 작성 완료 시 해당 영역이 출력되지 않습니다.
      </p>

      <div className="w-full items-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <UserInfoItem 
            key={item.id}  // 여기서 item.id를 key로 사용
            type={item.type}
            displayType={item.displayType}
            value={item.value}
            onRemove={() => handleRemoveItem(item.id)}
            onEdit={() => setActiveField({ type: item.type, id: item.id })}
          />
        ))}
      </div>

      <ModalComponent isOpen={!!activeField} onClose={() => setActiveField(null)}>
        {activeField && fieldComponents[activeField.type]}
      </ModalComponent>

      <ModalComponent isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)}>
        <CustomFieldInput onChange={(title, value) => handleFieldChange('custom', { title, value })} />
      </ModalComponent>
    </div>
  );
};

export default UserInfoForm;