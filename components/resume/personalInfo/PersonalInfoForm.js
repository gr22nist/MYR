import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadPersonalInfo, savePersonalInfo, toggleExpanded, removeItem } from '@/redux/slices/personalInfoSlice';
import ModalComponent from './ModalComponent';
import PersonalInfoItem from './PersonalInfoItem';
import AddressInput from './inputs/AddressInput';
import BirthDateInput from './inputs/BirthDateInput';
import PhoneInput from './inputs/PhoneInput';
import EmailInput from './inputs/EmailInput';
import SalaryInput from './inputs/SalaryInput';
import CustomFieldInput from './inputs/CustomFieldInput';

const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  const { items, isExpanded, status } = useSelector(state => state.personalInfo);
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadPersonalInfo());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>로딩 중...</div>;
  }

  if (status === 'failed') {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  const typeToKorean = {
    address: '주소',
    birthDate: '생년월일',
    phone: '전화번호',
    email: '이메일',
    salary: '연봉',
    custom: '자유서식'
  };

  const handleFieldChange = (field, value) => {
    const newItem = { 
      type: field, 
      value: field === 'custom' ? value.value : value, 
      displayType: field === 'custom' ? value.title : typeToKorean[field],
      id: Date.now()
    };
    dispatch(savePersonalInfo(newItem));
    setActiveField(null);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
    dispatch(savePersonalInfo({ id: itemId })); // 삭제된 항목을 DB에도 반영
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
    <div className="personal-info">
      <button onClick={() => dispatch(toggleExpanded())} className="expand-button">
        {isExpanded ? '개인정보 접기' : '개인정보 펼치기'}
      </button>
      
      {isExpanded && (
        <div>
          <div className="item-buttons flex flex-wrap gap-2 mb-4">
            {Object.entries(typeToKorean).map(([type, label]) => (
              <button 
                key={type}
                onClick={() => setActiveField(type)}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {label} 입력
              </button>
            ))}
          </div>
          
          <div className="items-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <PersonalInfoItem 
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
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;