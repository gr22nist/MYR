import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import PropTypes from 'prop-types';
import SortableItem from '@/components/common/SortableItem';
import TagButtons from '@/components/common/TagButtons';
import ModalComponent from '@/components/common/ModalComponent';
import UserInfoItem from './UserInfoItem';
import AddressInput from './inputs/AddressInput';
import BirthDateInput from './inputs/BirthDateInput';
import PhoneInput from './inputs/PhoneInput';
import EmailInput from './inputs/EmailInput';
import SalaryInput from './inputs/SalaryInput';
import CustomInput from './inputs/CustomInput';
import { typeToKorean } from '@/constants/resumeConstants';
import useUserInfoStore from '@/store/userInfoStore';

const tags = [
  { type: 'address', label: '주소' },
  { type: 'birthDate', label: '생년월일' },
  { type: 'phone', label: '연락처' },
  { type: 'email', label: '이메일' },
  { type: 'salary', label: '희망연봉' }
];

const SortableUserInfoItem = React.memo(function SortableUserInfoItem({ item, onRemove, onEdit, isRemoving, isDragging }) {
  return (
    <SortableItem
      id={item.id}
      isRemoving={isRemoving}
      isDragging={isDragging}
    >
      {(dragHandleProps) => (
        <UserInfoItem
          {...item}
          displayType={item.displayType || typeToKorean[item.type] || item.type}
          onRemove={onRemove}
          onEdit={onEdit}
          dragHandleProps={dragHandleProps}
        />
      )}
    </SortableItem>
  );
});

SortableUserInfoItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isRemoving: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

const UserInfoForm = () => {
  const { items, addUserInfo, updateUserInfo, removeUserInfo, reorderUserInfo, loadUserInfo, status } = useUserInfoStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [disabledTags, setDisabledTags] = useState([]);
  const nodeRefs = useRef(new Map());
  const itemRefs = useRef(new Map());
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await loadUserInfo();
      setIsLoading(false);
    };
    loadData();
  }, [loadUserInfo]);

  useEffect(() => {
  }, [items, status]);

  useEffect(() => {
    if (Array.isArray(items)) {
      setDisabledTags(items.map(item => item.type));
    }
  }, [items]);

  const handleFieldChange = useCallback((type, value) => {
    if (activeField && activeField.id) {
      const updatedItem = { 
        id: activeField.id, 
        type, 
        value,
        displayType: type === 'custom' ? value.title : typeToKorean[type]
      };
      updateUserInfo(updatedItem);
    } else {
      const newItem = { 
        type, 
        value,
        displayType: type === 'custom' ? value.title : typeToKorean[type]
      };
      addUserInfo(newItem);
    }
    setActiveField(null);
  }, [activeField, addUserInfo, updateUserInfo]);

  const handleRemoveItem = useCallback((id) => {
    removeUserInfo(id);
  }, [removeUserInfo]);

  const fieldComponents = {
    address: (initialValue) => (
      <AddressInput 
        onChange={(value) => handleFieldChange('address', value)} 
        onClose={() => setActiveField(null)}
        initialValue={initialValue}
      />
    ),
    birthDate: (initialValue) => (
      <BirthDateInput 
        onChange={(value) => handleFieldChange('birthDate', value)} 
        onClose={() => setActiveField(null)}
        initialValue={initialValue}
      />
    ),
    phone: (initialValue) => (
      <PhoneInput 
        onChange={(value) => handleFieldChange('phone', value)} 
        onClose={() => setActiveField(null)}
        initialValue={initialValue}
      />
    ),
    email: (initialValue) => (
      <EmailInput 
        onChange={(value) => handleFieldChange('email', value)} 
        onClose={() => setActiveField(null)}
        initialValue={initialValue}
      />
    ),
    salary: (initialValue) => (
      <SalaryInput 
        onChange={(value) => handleFieldChange('salary', value)} 
        onClose={() => setActiveField(null)}
        initialValue={initialValue}
      />
    ),
    custom: (initialValue) => (
      <CustomInput 
        onChange={(title, value) => handleFieldChange('custom', { title, value })} 
        onClose={() => setActiveField(null)}
        initialValue={initialValue}
      />
    )
  };

  const renderAddSection = () => (
    <div className='controls-container'>
      <div className='info-message'>
        작성이 필요한 개인정보(병역 유무, 성별, 나이 등)가 있는 경우에는 자유서식을 사용해보세요. 
        추가된 항목이 없으면 작성 완료 시 해당 영역이 보이지 않습니다.
      </div>
      <div className='controls'>
        <button 
          onClick={() => setIsCustomModalOpen(true)}
          className='controls-custom-btn'
        >
          + 개인정보 자유 서식
        </button>
        
        <div className='control-type-btn'>
          <TagButtons 
            tags={tags}
            activeTag={activeField?.type}
            onTagClick={(type) => setActiveField({ type, id: null })}
            disabledTags={disabledTags}
          />
        </div>
      </div>
    </div>
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event) => {
    setDraggedItem(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      reorderUserInfo(oldIndex, newIndex);
    }
    setDraggedItem(null);
  }, [items, reorderUserInfo]);

  const memoizedItems = useMemo(() => items.map((item) => (
    <SortableUserInfoItem
      key={item.id}
      item={item}
      onRemove={() => handleRemoveItem(item.id)}
      onEdit={() => setActiveField({ type: item.type, id: item.id })}
      isRemoving={false}
      isDragging={draggedItem === item.id}
    />
  )), [items, draggedItem, handleRemoveItem, setActiveField]);

  if (isLoading) {
    return null;
  }

  return (
    <div className='userinfo-form'>
      {renderAddSection()}
      
      {items.length > 0 && (
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
            <div className='grid-container'>
              {memoizedItems}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ModalComponent isOpen={!!activeField} onClose={() => setActiveField(null)}>
        {activeField && (() => {
          const currentItem = items.find(item => item.id === activeField.id);
          const initialValue = currentItem ? currentItem.value : null;
          return fieldComponents[activeField.type](initialValue);
        })()}
      </ModalComponent>

      <ModalComponent isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)}>
        <CustomInput 
          onChange={(title, value) => handleFieldChange('custom', { title, value })} 
          onClose={() => setIsCustomModalOpen(false)}
        />
      </ModalComponent>
    </div>
  );
};

export default UserInfoForm;