import React, { useState } from 'react';

const EmailInput = ({ onChange }) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleConfirm = () => {
    if (isValid && email) {
      onChange(email);
      setEmail(''); // 입력 필드 초기화
    }
  };

  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleChange}
          placeholder="example@example.com"
          className={`flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${!isValid && email ? 'border-red-500' : ''}`}
        />
        <button
          onClick={handleConfirm}
          disabled={!isValid || !email}
          className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          확인
        </button>
      </div>
      {!isValid && email && <p className="mt-1 text-sm text-red-500">유효한 이메일 주소를 입력해주세요.</p>}
    </div>
  );
};

export default EmailInput;
