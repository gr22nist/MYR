import React from 'react';
import useResumeStore from '@/store/resumeStore';
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
  const { profile, userInfo } = useResumeStore();

  // 개인 정보가 입력된 필드가 있는지 체크
  //const hasuserInfo = Object.values(userInfo).some((value) => value !== '');

  return (
    <div className="p-4">
      <h2 className="lg:text-2xl text-lg font-bold mb-4">미리보기</h2>

      {/* 프로필 섹션 */}
      <div className="mb-4">
        <ProfilePreview profile={profile} imageUrl={profile.imageUrl} />
      </div>

      {/* 개인 정보 섹션 */}
    </div>
  );
};

export default CreatePreview;
