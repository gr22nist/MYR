import React from 'react';
import { decryptData } from '@/utils/cryptoUtils';
import Image from 'next/image';
import { Fragment } from 'react';


const renderWithLineBreaks = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, index) => (
    <Fragment key={`line-${index}`}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </Fragment>
  ));
};

const ResumePreview = ({ resumeData }) => {
  if (!resumeData) return <div>데이터를 불러오는 중...</div>;

  console.log('Raw resumeData:', resumeData);

  const decryptSection = (section) => {
    console.log('Original section data:', section);
    if (Array.isArray(section)) {
      return section.map((item) => ({
        ...item,
        value: item.value ? decryptData(item.value) : null,
      }));
    }
    if (typeof section === 'object') {
      const decryptedSection = {};
      Object.keys(section).forEach((key) => {
        if (key === 'profilePhoto') {
          decryptedSection[key] = section[key];
        } else {
          decryptedSection[key] = section[key].value ? decryptData(section[key].value) : null;
        }
      });
      return decryptedSection;
    }
    return section;
  };

  const renderSection = (section) => {
    const decryptedData = decryptSection(section.data);
    console.log('Decrypted data for section:', section.type, decryptedData);

    switch (section.type) {
      case 'profile':
        return (
          <div key="profile" className="profile-container">
            <div className="profile-title">
              <p className="profile-text-area-title leading-normal">
                {renderWithLineBreaks(decryptedData.profileData?.title)}
              </p>
              {decryptedData.profilePhoto && decryptedData.profilePhoto.value && (
                <div className="w-[110px] h-[144px] relative">
                  <Image
                    src={decryptedData.profilePhoto.value}
                    alt="Profile"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
            <div className="profile-text-area-paragraph">
              {renderWithLineBreaks(decryptedData.profileData?.paragraph)}
            </div>
          </div>
        );
      case 'userInfo':
        return (
          <div key="userInfo">
            <h2>기본 정보</h2>
            {decryptedData.map((info, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={index}>{renderWithLineBreaks(info.value?.name)}</p>
            ))}
          </div>
        );
      case 'careers':
        return (
          <div key="careers">
            <h2>경력</h2>
            {decryptedData.map((career, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index}>
                <p>{career.value?.company || '회사명 없음'}</p>
                <p>{career.value?.position || '직책 없음'}</p>
                <div>{renderWithLineBreaks(career.value?.description)}</div>
              </div>
            ))}
          </div>
        );
      case 'educations':
        return (
          <div key="educations">
            <h2>학력</h2>
            {decryptedData.map((education, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index}>
                <p>{education.value?.school || '학교명 없음'}</p>
                <p>{education.value?.major || '전공 없음'}</p>
                <div>{renderWithLineBreaks(education.value?.description)}</div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div id="resume-preview">
      {resumeData.map((section) => renderSection(section))}
    </div>
  );
};

export default ResumePreview;
