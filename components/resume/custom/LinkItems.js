import React, { useState } from 'react';
import FloatingLabelInput from '@/components/common/FloatingLabelInput';

const LinkItems = ({ links, onChange }) => {
  const [newSiteName, setNewSiteName] = useState('');
  const [newLink, setNewLink] = useState('');

  const formatUrl = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleAddLink = () => {
    if (newSiteName && newLink) {
      const formattedLink = formatUrl(newLink);
      onChange([...links, { siteName: newSiteName, link: formattedLink }]);
      setNewSiteName('');
      setNewLink('');
    }
  };

  const handleRemoveLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    onChange(newLinks);
  };

  const handleLinkChange = (e) => {
    setNewLink(e.target.value);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <FloatingLabelInput
          label="사이트명"
          value={newSiteName}
          onChange={(e) => setNewSiteName(e.target.value)}
          placeholder="사이트 이름을 입력하세요"
          spellCheck="false"
          maxLength="100"
          className="mr-2"
        />
        <FloatingLabelInput
          label="링크"
          value={newLink}
          onChange={handleLinkChange}
          placeholder="https://"
          spellCheck="false"
          className="mr-2"
        />
        <button onClick={handleAddLink} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">추가</button>
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

export default LinkItems;
