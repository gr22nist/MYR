import PropTypes from 'prop-types';

const GraduationStatus = ({ status, onChange }) => {
  const statusOptions = ['졸업', '졸업예정', '재학중'];
  
  return (
    <div className='graduation-status-group'>
      {statusOptions.map((option) => (
        <button 
          key={option}
          className={`graduation-status-btn ${status === option ? 'active' : ''}`}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

GraduationStatus.propTypes = {
  status: PropTypes.oneOf(['졸업', '졸업예정', '재학중', '']),
  onChange: PropTypes.func.isRequired
};

export default GraduationStatus;