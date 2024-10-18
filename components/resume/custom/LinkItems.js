import React, { useState, useCallback, useRef } from 'react';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';

const LinkItems = ({ links = [], onChange, isEditing }) => {
  const [error, setError] = useState('');
  const [siteName, setSiteName] = useState('');
  const [link, setLink] = useState('');
  const siteNameInputRef = useRef(null);
  const linkInputRef = useRef(null);

  const formatUrl = (url) => {
    if (typeof url !== 'string') {
      return '';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const formattedUrl = `https://${url.startsWith('www.') ? '' : 'www.'}${url}`;
    return formattedUrl;
  };

  const isValidDomain = (url) => {
    const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const isValid = pattern.test(url);
    return isValid;
  };

  const handleAddLink = useCallback(() => {
    if (siteName && link) {
      const formattedLink = formatUrl(link);
      if (formattedLink && isValidDomain(formattedLink)) {
        const newLinks = [...links, { siteName, link: formattedLink }];
        onChange(newLinks);
        setSiteName('');
        setLink('');
        setError('');
        
        // 입력 필드 초기화
        if (siteNameInputRef.current) siteNameInputRef.current.value = '';
        if (linkInputRef.current) linkInputRef.current.value = '';
      } else {
        setError('유효하지 않은 도메인 형식입니다.');
      }
    } else {
      setError('사이트명과 링크를 모두 입력해주세요.');
    }
  }, [siteName, link, links, onChange]);

  const handleRemoveLink = useCallback((index) => {
    const newLinks = links.filter((_, i) => i !== index);
    onChange(newLinks);
  }, [links, onChange]);

  const handleSiteNameChange = useCallback((e) => {
    setSiteName(e.target.value);
  }, []);

  const handleLinkChange = useCallback((e) => {
    setLink(e.target.value);
  }, []);

  return (
    <div>
      {isEditing && (
        <div className="flex flex-col mb-4">
          <div className="flex w-full items-center gap-2">
            <FloatingLabelInput
              inputRef={siteNameInputRef}
              label="사이트명"
              value={siteName}
              onChange={handleSiteNameChange}
              placeholder="사이트 이름을 입력하세요"
              spellCheck="false"
              maxLength="100"
            />
            <FloatingLabelInput
              inputRef={linkInputRef}
              label="링크"
              value={link}
              onChange={handleLinkChange}
              placeholder="https://"
              spellCheck="false"
            />
            <button onClick={handleAddLink} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">추가</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
            <div className="flex-grow flex items-center space-x-2 min-w-0">
              <span className="font-semibold whitespace-nowrap">{item.siteName}</span>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {item.link}
              </a>
            </div>
            {isEditing && (
              <button
                onClick={() => handleRemoveLink(index)}
                className="text-red-500 hover:text-red-700 flex-shrink-0"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(LinkItems);
