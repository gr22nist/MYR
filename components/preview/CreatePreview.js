import React from 'react';
import { useSelector } from 'react-redux';
import PersonalInfoPreview from './PersonalInfoPreview';
import ProfilePreview from './ProfilePreview';

const fieldConfigs = {
  contact: { label: '연락처' },
  email: { label: '이메일' },
  address: { label: '주소' },
  salary: { label: '희망 연봉' },
  birthDate: { label: '생년월일' },
  // gender 필드 제거됨, 필요시 자유서식 필드 사용 가능
};

const CreatePreview = () => {
  const { profile, personalInfo } = useSelector((state) => state.resume);

  // 개인 정보가 입력된 필드가 있는지 체크
  const hasPersonalInfo = Object.values(personalInfo).some((value) => value !== '');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">미리보기</h2>

      {/* 프로필 섹션 */}
      <div className="mb-4">
        <ProfilePreview profile={profile} imageUrl={profile.imageUrl} />
      </div>

      {/* 개인 정보 섹션 */}
      {hasPersonalInfo && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">개인 정보</h3>
          <PersonalInfoPreview formData={personalInfo} fieldConfigs={fieldConfigs} />
        </div>
      )}
    </div>
  );
};

export default CreatePreview;
