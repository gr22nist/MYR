import React, { useState, useCallback, useRef } from 'react';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';

const LinkItems = ({ links, onChange }) => {
  const [error, setError] = useState('');
  const [siteName, setSiteName] = useState('');
  const [link, setLink] = useState('');
  const siteNameInputRef = useRef(null);
  const linkInputRef = useRef(null);

  const formatUrl = (url) => {
    console.log('formatUrl 입력값:', url);
    if (typeof url !== 'string') {
      console.log('url이 문자열이 아님');
      return '';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('이미 http:// 또는 https://로 시작함');
      return url;
    }
    const formattedUrl = `https://${url.startsWith('www.') ? '' : 'www.'}${url}`;
    console.log('formatUrl 결과:', formattedUrl);
    return formattedUrl;
  };

  const isValidDomain = (url) => {
    console.log('isValidDomain 검사 중:', url);
    const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const isValid = pattern.test(url);
    console.log('도메인 유효성:', isValid);
    return isValid;
  };

  const handleAddLink = useCallback(() => {
    console.log('handleAddLink 시작 - siteName:', siteName, 'link:', link);
    if (siteName && link) {
      const formattedLink = formatUrl(link);
      console.log('포맷된 링크:', formattedLink);
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
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <FloatingLabelInput
            inputRef={siteNameInputRef}
            label="사이트명"
            value={siteName}
            onChange={handleSiteNameChange}
            placeholder="사이트 이름을 입력하세요"
            spellCheck="false"
            maxLength="100"
            className="mr-2"
          />
          <FloatingLabelInput
            inputRef={linkInputRef}
            label="링크"
            value={link}
            onChange={handleLinkChange}
            placeholder="https://"
            spellCheck="false"
            className="mr-2"
          />
          <button onClick={handleAddLink} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">추가</button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((item, index) => (
          <div key={index} className="relative group">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors inline-block"
            >
              {item.siteName}
            </a>
            <button
              onClick={() => handleRemoveLink(index)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(LinkItems);