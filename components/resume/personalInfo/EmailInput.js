import React, { useState, useEffect } from 'react';

const EmailInput = ({ onChange }) => {
  const [localPart, setLocalPart] = useState('');
  const [domain, setDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const email = `${localPart}@${domain}`;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(email));
    onChange(email);
  }, [localPart, domain, onChange]);

  const handleLocalPartChange = (e) => {
    setLocalPart(e.target.value);
  };

  const handleDomainChange = (e) => {
    if (e.target.value === 'custom') {
      setIsCustomDomain(true);
      setDomain('');
    } else {
      setIsCustomDomain(false);
      setDomain(e.target.value);
    }
  };

  const handleCustomDomainChange = (e) => {
    setDomain(e.target.value);
  };

  return (
    <div>
      <div className="flex">
        <input
          type="text"
          placeholder="메일 주소를 입력해주세요"
          value={localPart}
          onChange={handleLocalPartChange}
          className="border p-2"
        />
        <span className="p-2">@</span>
        {isCustomDomain ? (
          <input
            type="text"
            placeholder="도메인 입력"
            value={domain}
            onChange={handleCustomDomainChange}
            className="border p-2"
          />
        ) : (
          <select
            value={domain}
            onChange={handleDomainChange}
            className="border p-2"
          >
            <option value="">선택</option>
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
            <option value="yahoo.com">yahoo.com</option>
            <option value="kakao.com">kakao.com</option>
            <option value="hanmail.net">hanmail.net</option>
            <option value="hotmail.com">hotmail.com</option>
            <option value="nate.com">nate.com</option>
            <option value="custom">직접 입력</option>
          </select>
        )}
      </div>
      {!isValid && (
        <p className="text-red-500 text-sm mt-1">유효한 이메일 주소를 입력하세요.</p>
      )}
    </div>
  );
};

export default EmailInput;
