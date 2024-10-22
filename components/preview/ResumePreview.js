import React, { Fragment } from 'react';
import { decryptData } from '@/utils/cryptoUtils';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';


const renderWithLineBreaks = (text) => {
  if (!text) return null;
  if (typeof text !== 'string') {
    text = JSON.stringify(text);
  }
  return text.split('\n').map((line, index) => (
    <Fragment key={`line-${index}`}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </Fragment>
  ));
};

const ResumePreview = ({ resumeData }) => {
  if (!resumeData) return <div>데이터를 불러오는 중...</div>;

  const decryptSection = (section) => {
    if (Array.isArray(section)) {
      return section.map((item) => ({
        ...item,
        value: item.value ? decryptData(item.value) : null,
      }));
    }
    if (typeof section === 'object' && section !== null) {
      const decryptedSection = {};
      Object.keys(section).forEach((key) => {
        if (key === 'profilePhoto') {
          decryptedSection[key] = section[key];
        } else if (key === 'value' && typeof section[key] === 'string') {
          try {
            const decryptedValue = decryptData(section[key]);
            // 복호화된 값이 이미 객체인지 확인
            decryptedSection[key] = typeof decryptedValue === 'object' ? decryptedValue : JSON.parse(decryptedValue);
          } catch (error) {
            console.error('Failed to parse decrypted data:', error);
            decryptedSection[key] = decryptData(section[key]);
          }
        } else if (typeof section[key] === 'object' && section[key] !== null) {
          decryptedSection[key] = section[key].value ? decryptData(section[key].value) : null;
        } else {
          decryptedSection[key] = section[key];
        }
      });
      return decryptedSection;
    }
    return section;
  };

  const renderSection = (section) => {
    const decryptedData = decryptSection(section.data);

    switch (section.type) {
      case 'profile':
        return (
          <div key="profile" className="profile-container pdf-section">
            <div className="profile-title">
              <p className="profile-text-area-title leading-normal">
                {renderWithLineBreaks(decryptedData.profileData?.title || '')}
              </p>
              {decryptedData.profilePhoto && decryptedData.profilePhoto.value && (
                <div className="w-[108px] h-[140px] relative">
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
          <div key="userInfo" className="userinfo-container pdf-section mb-6">
            <div className="userinfo-grid">
              {decryptedData.map((info, index) => {
                let displayValue, displayType;
                
                if (typeof info.value === 'object' && info.value !== null) {
                  if (info.type === 'custom') {
                    displayType = info.value.title;
                    displayValue = info.value.value;
                  } else {
                    displayType = info.value.displayType || info.type;
                    displayValue = info.value.value;
                  }
                } else {
                  displayType = info.displayType || info.type;
                  displayValue = info.value;
                }

                if (typeof displayValue === 'object' && displayValue !== null) {
                  displayValue = displayValue.value || JSON.stringify(displayValue);
                }

                return (
                  <div key={index} className="userinfo-item flex flex-col">
                    <span className="userinfo-label font-bold mb-1">{displayType || '정보'}</span>
                    <span className="userinfo-value">
                      {renderWithLineBreaks(displayValue)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'careers':
        if (decryptedData.length === 0 || !decryptedData.some(career => career.value && Object.values(career.value).some(v => v !== null && v !== ''))) return null;
        return (
          <div key="careers" className="careers-section pdf-section mb-6">
            <h2 className="section-title">경력</h2>
            {decryptedData.map((career, index) => (
              career.value && Object.values(career.value).some(v => v !== null && v !== '') ? (
                <div key={index} className="career-item">
                  {career.value.companyName && <h3 className="company-name">{career.value.companyName}</h3>}
                  {career.value.position && <p className="position">{career.value.position}</p>}
                  {(career.value.startDate || career.value.endDate) && (
                    <p className="date-range">
                      {career.value.startDate || ''}
                      {(career.value.startDate && career.value.endDate) && ' - '}
                      {career.value.isCurrent ? '현재' : career.value.endDate || ''}
                    </p>
                  )}
                  {career.value.mainTask && (
                    <div className="main-tasks">
                      {renderWithLineBreaks(career.value.mainTask)}
                    </div>
                  )}
                </div>
              ) : null
            ))}
          </div>
        );
      case 'educations':
        if (decryptedData.length === 0 || !decryptedData.some(education => education.value && Object.values(education.value).some(v => v !== null && v !== ''))) return null;
        return (
          <div key="educations" className="educations-section pdf-section mb-6">
            <h2 className="section-title">학력</h2>
            {decryptedData.map((education, index) => (
              education.value && Object.values(education.value).some(v => v !== null && v !== '') ? (
                <div key={index} className="education-item">
                  {education.value.schoolName && <h3 className="school-name">{education.value.schoolName}</h3>}
                  {education.value.major && <p className="major">{education.value.major}</p>}
                  {(education.value.startDate || education.value.endDate) && (
                    <p className="date-range">
                      {education.value.startDate || ''}
                      {(education.value.startDate && education.value.endDate) && ' - '}
                      {education.value.isCurrent ? '현재' : education.value.endDate || ''}
                    </p>
                  )}
                  {education.value.graduationStatus && <p className="graduation-status">{education.value.graduationStatus}</p>}
                </div>
              ) : null
            ))}
          </div>
        );
      case 'custom':
        const customData = decryptedData.value;

        return (
          <div key={customData.id || decryptedData.id} className="custom-section">
            <h2 className="section-title">{customData.title || ''}</h2>
            {customData.type === 'link' ? (
              <div className="link-items-container">
                {(customData.links || []).map((link, index) => (
                  <div key={index} className="link-item">
                    <div className="link-content">
                      <span className="link-site-name">{link.siteName}</span>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-url"
                      >
                        {link.link}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="custom-content">
                {renderWithLineBreaks(customData.content || '')}
              </div>
            )}
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
