import React from 'react';
import { decryptData } from '@/utils/cryptoUtils';
import Image from 'next/image';
import { Fragment } from 'react';


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

  console.log('Raw resumeData:', resumeData);

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
          <div key="profile" className="profile-container">
            <div className="profile-title">
              <p className="profile-text-area-title leading-normal">
                {renderWithLineBreaks(decryptedData.profileData?.title || '')}
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
          <div key="userInfo" className="user-info-container">
            <h2 className="section-title">기본 정보</h2>
            <div className="user-info-grid">
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
                  <div key={index} className="user-info-item flex flex-col">
                    <span className="user-info-label font-bold mb-1">{displayType || '정보'}</span>
                    <span className="user-info-value">
                      {renderWithLineBreaks(displayValue)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'careers':
        return (
          <div key="careers" className="careers-section">
            <h2 className="section-title">경력</h2>
            {decryptedData.map((career, index) => (
              <div key={index} className="career-item">
                <h3 className="company-name">{career.value?.companyName || '회사명 없음'}</h3>
                <p className="position">{career.value?.position || '직책 없음'}</p>
                <p className="date-range">
                  {career.value?.startDate || '시작일 없음'} - {career.value?.isCurrent ? '현재' : (career.value?.endDate || '종료일 없음')}
                </p>
                <div className="main-tasks">
                  {renderWithLineBreaks(career.value?.mainTask || '주요 업무 내용 없음')}
                </div>
              </div>
            ))}
          </div>
        );
      case 'educations':
        return (
          <div key="educations" className="educations-section">
            <h2 className="section-title">학력</h2>
            {decryptedData.map((education, index) => (
              <div key={index} className="education-item">
                <h3 className="school-name">{education.value?.schoolName || '학교명 없음'}</h3>
                <p className="major">{education.value?.major || '전공 없음'}</p>
                <p className="date-range">
                  {education.value?.startDate || '시작일 없음'} - {education.value?.isCurrent ? '현재' : (education.value?.endDate || '종료일 없음')}
                </p>
                <p className="graduation-status">{education.value?.graduationStatus || '졸업 상태 없음'}</p>
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
