import React, { useState } from 'react';
import ModalComponent from '../ModalComponent';
import AddressInput from './AddressInput';
import BirthDateInput from './BirthDateInput';
import PhoneInput from './PhoneInput';
import EmailInput from './EmailInput';
import SalaryInput from './SalaryInput';
import CustomFieldInput from './CustomFieldInput';

const PersonalInfoForm = () => {
  const [activeField, setActiveField] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    address: '',
    birthDate: '',
    phone: '',
    email: '',
    salary: '',
    customField: { title: '', value: '' },
  });

  const handleFieldChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    setActiveField(null); // 모달 닫기
  };

  const fieldComponents = {
    address: <AddressInput onChange={(value) => handleFieldChange('address', value)} />,
    birthDate: <BirthDateInput onChange={(value) => handleFieldChange('birthDate', value)} />,
    phone: <PhoneInput onChange={(value) => handleFieldChange('phone', value)} />,
    email: <EmailInput onChange={(value) => handleFieldChange('email', value)} />,
    salary: <SalaryInput onChange={(value) => handleFieldChange('salary', value)} />,
    customField: <CustomFieldInput onChange={(title, value) => handleFieldChange('customField', { title, value })} />,
  };

  return (
    <div>
      {/* 버튼 클릭으로 모달 열기 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <button className="p-2 bg-blue-500 text-white" onClick={() => setActiveField('address')}>주소 입력</button>
        <button className="p-2 bg-blue-500 text-white" onClick={() => setActiveField('birthDate')}>생년월일 입력</button>
        <button className="p-2 bg-blue-500 text-white" onClick={() => setActiveField('phone')}>전화번호 입력</button>
        <button className="p-2 bg-blue-500 text-white" onClick={() => setActiveField('email')}>이메일 입력</button>
        <button className="p-2 bg-blue-500 text-white" onClick={() => setActiveField('salary')}>연봉 입력</button>
        <button className="p-2 bg-blue-500 text-white" onClick={() => setActiveField('customField')}>자유서식 입력</button>
      </div>

      {/* 모달 컴포넌트 */}
      <ModalComponent isOpen={!!activeField} onClose={() => setActiveField(null)}>
        {activeField && fieldComponents[activeField]}
      </ModalComponent>

      {/* 3개 필드씩 한 줄에 출력 */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {Object.entries(personalInfo).map(([key, value]) => {
          if (key === 'customField' && value.title && value.value) {
            return (
              <div key={key} className="border p-2">
                <strong>{value.title}: </strong>{value.value}
              </div>
            );
          }
          if (key === 'customField') {
            return null; // 비어 있을 경우 렌더링하지 않음
          }
          return value && <div key={key} className="border p-2">{value}</div>;
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
