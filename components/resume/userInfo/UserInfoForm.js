import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TagButtons from '@/components/common/TagButtons';
import ModalComponent from './ModalComponent';
import UserInfoItem from './UserInfoItem';
import AddressInput from './inputs/AddressInput';
import BirthDateInput from './inputs/BirthDateInput';
import PhoneInput from './inputs/PhoneInput';
import EmailInput from './inputs/EmailInput';
import SalaryInput from './inputs/SalaryInput';
import CustomFieldInput from './inputs/CustomFieldInput';
import { typeToKorean } from '@/constants/resumeConstants';
import { useTransitionClasses } from '@/hooks/useTransitionClasses';
import useUserInfoStore from '@/store/userInfoStore';

const tags = [
  { type: 'address', label: '주소' },
  { type: 'birthDate', label: '생년월일' },
  { type: 'phone', label: '연락처' },
  { type: 'email', label: '이메일' },
  { type: 'salary', label: '희망연봉' }
];

const UserInfoForm = () => {
  const { items, status, loadUserInfo, saveUserInfo, updateItem, removeItem } = useUserInfoStore();
  const [activeField, setActiveField] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [disabledTags, setDisabledTags] = useState([]);
  const nodeRefs = useRef(new Map());
  const itemRefs = useRef(new Map());

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  useEffect(() => {
    if (Array.isArray(items)) {
      setDisabledTags(items.map(item => item.type));
    }
  }, [items]);

  const handleFieldChange = useCallback((type, value, id) => {
    let newItem = {
      type,
      displayType: type === 'custom' ? value.title : (typeToKorean[type] || '자유 서식'),
      value: type === 'custom' ? value : value
    };

    if (id) {
      const existingItem = items.find(item => item.id === id);
      if (existingItem) {
        newItem = {
          ...existingItem,
          ...newItem,
          id
        };
      }
      updateItem(newItem);
    } else {
      saveUserInfo(newItem);
    }
    setActiveField(null);
    setIsCustomModalOpen(false);
  }, [updateItem, saveUserInfo, items]);

  const handleRemoveItem = useCallback((id) => {
    removeItem(id);
  }, [removeItem]);

  const fieldComponents = {
    address: <AddressInput onChange={(value) => handleFieldChange('address', value, activeField?.id)} />,
    birthDate: <BirthDateInput onChange={(value) => handleFieldChange('birthDate', value, activeField?.id)} />,
    phone: <PhoneInput onChange={(value) => handleFieldChange('phone', value, activeField?.id)} />,
    email: <EmailInput onChange={(value) => handleFieldChange('email', value, activeField?.id)} />,
    salary: <SalaryInput onChange={(value) => handleFieldChange('salary', value, activeField?.id)} />,
    custom: <CustomFieldInput onChange={(title, value) => handleFieldChange('custom', { title, value }, activeField?.id)} />
  };

  const renderAddSection = () => (
    <div className="w-full py-3 px-2 flex flex-col gap-6 items-center border rounded-lg bg-gray-50">
      <div className="info-message bg-mono-ee border-l-4 border-mono-33 text-mono-66 font-bold p-4 w-full">
        <p className="text-sm">
          작성이 필요한 개인정보(병역 유무, 성별, 나이 등)가 있는 경우에는 자유서식을 사용해보세요. 
          추가된 항목이 없으면 작성 완료 시 해당 영역이 보이지 않습니다.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <button 
          onClick={() => setIsCustomModalOpen(true)}
          className="bg-secondary-dark text-white px-6 py-4 rounded-md hover:bg-accent-dark transition-colors text-base font-bold flex-shrink-0"
        >
          + 개인정보 자유 서식
        </button>
        
        <div className="flex items-center justify-center bg-white rounded-md p-2 min-h-[60px]">
          <TagButtons 
            tags={tags}
            activeTag={activeField?.type}
            onTagClick={(type) => setActiveField({ type, id: null })}
            disabledTags={disabledTags}
            className="flex-wrap justify-center"
          />
        </div>
      </div>
    </div>
  );

  if (status === 'loading') {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  return (
    <div className="personal-info-form">
      {renderAddSection()}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <TransitionGroup component={null}>
          {items.map((item) => {
            if (!nodeRefs.current.has(item.id)) {
              nodeRefs.current.set(item.id, React.createRef());
            }
            return (
              <CSSTransition
                key={item.id}
                nodeRef={nodeRefs.current.get(item.id)}
                timeout={300}
                classNames="fade"
              >
                <div ref={nodeRefs.current.get(item.id)}>
                  <UserInfoItem
                    type={item.type}
                    displayType={item.type === 'custom' ? item.value.title : (typeToKorean[item.type] || '자유 서식')}
                    value={item.type === 'custom' ? item.value.value : item.value}
                    onRemove={() => handleRemoveItem(item.id)}
                    onEdit={() => setActiveField({ type: item.type, id: item.id })}
                  />
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
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