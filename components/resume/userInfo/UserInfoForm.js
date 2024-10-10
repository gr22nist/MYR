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
import useUserInfo from '@/hooks/useUserInfo';

const tags = [
  { type: 'address', label: '주소' },
  { type: 'birthDate', label: '생년월일' },
  { type: 'phone', label: '연락처' },
  { type: 'email', label: '이메일' },
  { type: 'salary', label: '희망연봉' }
];

const SortableUserInfoItem = React.memo(function SortableUserInfoItem({ item, onRemove, onEdit, isRemoving, isDragging }) {
  const handleRemove = useCallback(() => onRemove(item.id), [onRemove, item.id]);
  const handleEdit = useCallback(() => onEdit({ type: item.type, id: item.id }), [onEdit, item.type, item.id]);

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
          onRemove={handleRemove}
          onEdit={handleEdit}
          dragHandleProps={dragHandleProps}
        />
      )}
    </SortableItem>
  );
}, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item &&
         prevProps.isRemoving === nextProps.isRemoving &&
         prevProps.isDragging === nextProps.isDragging;
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
  const { 
    items, 
    status, 
    error, 
    handleFieldChange, 
    handleRemoveItem, 
    reorderUserInfo,
    retryLoading
  } = useUserInfo();

  const [isLoading, setIsLoading] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [disabledTags, setDisabledTags] = useState([]);
  const nodeRefs = useRef(new Map());
  const itemRefs = useRef(new Map());
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (Array.isArray(items)) {
      setDisabledTags(items.map(item => item.type));
    }
  }, [items]);

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
    <div className="w-full py-3 px-2 flex flex-col gap-6 items-center border rounded-lg bg-gray-50">
      <div className="info-message bg-mono-ee border-l-4 border-mono-33 text-mono-66 font-bold p-4 w-full">
        <p className="lg:text-sm text-xs">
          작성이 필요한 개인정보(병역 유무, 성별, 나이 등)가 있는 경우에는 자유서식을 사용해보세요. 
          추가된 항목이 없으면 작성 완료 시 해당 영역이 보이지 않습니다.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <button 
          onClick={() => setIsCustomModalOpen(true)}
          className="bg-secondary-dark text-white px-6 py-4 rounded-md hover:bg-primary-light transition-colors text-base font-bold flex-shrink-0"
        >
          + 개인정보 자유 서식
        </button>
        
        <div className="flex items-center justify-center bg-white rounded-md p-2">
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
      onRemove={handleRemoveItem}
      onEdit={setActiveField}
      isRemoving={false}
      isDragging={draggedItem === item.id}
    />
  )), [items, draggedItem, handleRemoveItem, setActiveField]);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  if (status === 'error') {
    return (
      <div className="text-center py-4 text-red-500">
        오류 발생: {error}
        <button onClick={retryLoading} className="ml-2 text-blue-500 underline">
          다시 시도
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-4">로딩 중...</div>;
  }

  return (
    <div className="personal-info-form">
      {renderAddSection()}
      
      {items.length > 0 && (
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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