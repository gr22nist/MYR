import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loaduserInfo, saveuserInfo, removeItem } from '@/redux/slices/userInfoSlice';
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
    console.log('Dispatching loaduserInfo');
    dispatch(loaduserInfo()).unwrap()
      .then(() => console.log('userInfo loaded successfully'))
      .catch(error => console.error('Failed to load userInfo:', error));
  }, [dispatch]);

  useEffect(() => {
    console.log('Component mounted, loading userInfo');
    loadUserInfoData();
  }, [loadUserInfoData]);

  useEffect(() => {
    console.log('Current items in UserInfoForm:', items);
    if (items.length > 0) {
      console.log('UserInfo items loaded successfully');
    }
  }, [items]);

  if (status === 'loading') return <div>로딩 중...</div>;
  if (status === 'failed') return <div>데이터를 불러오는데 실패했습니다: {error}</div>;
  if (status !== 'succeeded') return null;  // items 체크 제거

  const typeToKorean = {
    address: '거주지역',
    birthDate: '생년월일',
    phone: '연락처',
    email: '이메일',
    salary: '희망연봉'
  };

  const handleFieldChange = (field, value) => {
    if (field !== 'custom' && items.some(item => item.type === field)) {
      alert(`${typeToKorean[field]}은(는) 이미 존재합니다.`);
      return;
    }

    const newItem = { 
      type: field, 
      value: field === 'custom' ? value.value : value, 
      displayType: field === 'custom' ? value.title : typeToKorean[field],
      id: Date.now().toString()
    };
    dispatch(saveuserInfo(newItem));
    setActiveField(null);
    setIsCustomModalOpen(false);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const fieldComponents = {
    address: <AddressInput onChange={(value) => handleFieldChange('address', value)} />,
    birthDate: <BirthDateInput onChange={(value) => handleFieldChange('birthDate', value)} />,
    phone: <PhoneInput onChange={(value) => handleFieldChange('phone', value)} />,
    email: <EmailInput onChange={(value) => handleFieldChange('email', value)} />,
    salary: <SalaryInput onChange={(value) => handleFieldChange('salary', value)} />,
    custom: <CustomFieldInput onChange={(title, value) => handleFieldChange('custom', { title, value })} />,
  };

  return (
    <div ref={containerRef} className="personal-info flex flex-col justify-center items-center">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => setIsCustomModalOpen(true)}
          className="add-info-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <span className="plus-icon">+</span> 개인정보 자유 서식
        </button>
      </div>
      
      <div className="tags-container flex flex-wrap gap-2 mb-4">
        <span className='tag px-3 py-2 rounded-md transition-colors'>추천태그: </span>
        {Object.entries(typeToKorean).map(([type, label]) => {
          const isDisabled = type !== 'custom' && items.some(item => item.type === type);
          return (
            <button 
              key={type}
              onClick={() => !isDisabled && setActiveField(type)}
              className={`tag px-3 py-2 rounded-md transition-colors ${
                isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                activeField === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={isDisabled}
            >
              #{label}
            </button>
          );
        })}
      </div>
      
      <p className="info-message text-sm text-gray-600 mb-4">
        추가된 항목이 없으면 알맞게 시 출력되지 않습니다. 꼭 필요한 개인정보만 작성해주세요.
      </p>

      <div className="w-full items-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <UserInfoItem 
            key={item.id}
            type={item.displayType}
            value={item.value}
            onRemove={() => handleRemoveItem(item.id)}
            onEdit={() => setActiveField(item.type)}
          />
        ))}
      </div>

      <ModalComponent isOpen={!!activeField} onClose={() => setActiveField(null)}>
        {activeField && fieldComponents[activeField]}
      </ModalComponent>

      <ModalComponent isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)}>
        <CustomFieldInput onChange={(title, value) => handleFieldChange('custom', { title, value })} />
      </ModalComponent>
    </div>
  );
};

export default UserInfoForm;