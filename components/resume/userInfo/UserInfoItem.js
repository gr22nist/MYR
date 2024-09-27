import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { EditBtn, DeleteBtn } from '@/components/icons/IconSet';
import { CSSTransition } from 'react-transition-group';

const UserInfoItem = ({ type, displayType, value, onRemove, onEdit }) => {
  const nodeRef = useRef(null);
  const displayValue = typeof value === 'string' ? value : 
                       (typeof value === 'object' && value !== null ? value.value : '');

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={true}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div ref={nodeRef} className="personal-info-item p-4 relative rounded-lg bg-mono-f5">
        <div className="text-sm font-bold mb-2 text-mono-99">{displayType}</div>
        <div className="text-mono-11 font-bold">{displayValue}</div>
        <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={onEdit} className="text-mono-dd hover:text-mono-66 duration-300">
            <EditBtn />
          </button>
          <button onClick={onRemove} className="text-mono-dd hover:text-red-700 duration-300">
            <DeleteBtn />
          </button>
        </div>
      </div>
    </CSSTransition>
  );
};

UserInfoItem.propTypes = {
  type: PropTypes.string.isRequired,
  displayType: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string
    })
  ]).isRequired,
  onRemove: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default UserInfoItem;