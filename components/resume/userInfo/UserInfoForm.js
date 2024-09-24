import React, { useState, useCallback, useMemo, useRef } from 'react';
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
import useUserInfo from '@/hooks/useUserInfo';
import { typeToKorean } from '@/constants/userInfoConstants';
import { useTransitionClasses } from '@/hooks/useTransitionClasses';

const UserInfoForm = () => {
  const { items, status, error, handleFieldChange, handleRemoveItem, retryLoading } = useUserInfo();
  const [activeField, setActiveField] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const nodeRefs = useRef(new Map());

  const handleRetry = useCallback(() => {
    retryLoading();
  }, [retryLoading]);

  const tags = useMemo(() => Object.entries(typeToKorean).map(([type, label]) => ({ type, label })), []);
  const disabledTags = useMemo(() => items.map(item => item.type), [items]);

  const fieldComponents = useMemo(() => {
    const getInitialValue = (id) => {
      if (!id) return '';
      const item = items.find(item => item.id === id);
      return item ? item.value : '';
    };

    return {
      address: <AddressInput 
        onChange={(value) => handleFieldChange('address', value, activeField?.id)} 
        initialValue={getInitialValue(activeField?.id)} 
      />,
      birthDate: <BirthDateInput 
        onChange={(value) => handleFieldChange('birthDate', value, activeField?.id)} 
        initialValue={getInitialValue(activeField?.id)} 
      />,
      phone: <PhoneInput 
        onChange={(value) => handleFieldChange('phone', value, activeField?.id)} 
        initialValue={getInitialValue(activeField?.id)} 
      />,
      email: <EmailInput 
        onChange={(value) => handleFieldChange('email', value, activeField?.id)} 
        initialValue={getInitialValue(activeField?.id)} 
      />,
      salary: <SalaryInput 
        onChange={(value) => handleFieldChange('salary', value, activeField?.id)} 
        initialValue={getInitialValue(activeField?.id)} 
      />,
      custom: <CustomFieldInput 
        onChange={(title, value) => handleFieldChange('custom', { title, value }, activeField?.id)} 
        initialValue={activeField?.id ? items.find(item => item.id === activeField.id) : null} 
      />,
    };
  }, [handleFieldChange, activeField, items]);

  const { classNames } = useTransitionClasses();

  if (status === 'loading') {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 mb-2">데이터를 불러오는데 실패했습니다: {error}</p>
        <button 
          onClick={handleRetry}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="personal-info flex flex-col gap-6 justify-center items-center w-full mx-auto">
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

      <TransitionGroup className="w-full items-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          if (!nodeRefs.current.has(item.id)) {
            nodeRefs.current.set(item.id, React.createRef());
          }
          return (
            <CSSTransition
              key={item.id}
              nodeRef={nodeRefs.current.get(item.id)}
              timeout={300}
              classNames={classNames}
            >
              <div ref={nodeRefs.current.get(item.id)}>
                <UserInfoItem 
                  type={item.type}
                  displayType={item.displayType}
                  value={item.value}
                  onRemove={() => handleRemoveItem(item.id)}
                  onEdit={() => setActiveField({ type: item.type, id: item.id })}
                />
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>

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