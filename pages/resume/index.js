import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import Profile from '@/components/resume/Profile';
import PersonalInfoForm from '@/components/resume/personalInfo/PersonalInfoForm';
import { resetResume } from '@/redux/slices/resumeSlice';
import { showToast } from '@/redux/slices/globalSlice';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { useIndexedDB } from '@/hooks/useIndexedDB';

const Resume = () => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    title: '',
    paragraph: '',
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { addItem, getItem } = useIndexedDB('resumeDB', 'resumeStore');

  // Debounced 저장 함수, useRef로 한 번만 생성
  const debouncedSave = useRef(
    debounce((newData) => {
      addItem({ id: 'profile', data: newData });
      dispatch(showToast({ message: '자동 임시 저장되었습니다.', type: 'success' }));
    }, 1000)
  ).current;

  // 임시저장 버튼 클릭 시 데이터 저장
  const handleSave = () => {
    addItem({ id: 'profile', data: profileData });
    dispatch(showToast({ message: '임시 저장되었습니다.', type: 'success' }));
  };

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getItem('profile');
      if (savedData) {
        setProfileData(savedData.data);
      }
    };

    fetchData();
  }, [getItem]);

  const handleInputChange = (field, value) => {
    const updatedData = { ...profileData, [field]: value };
    setProfileData(updatedData);
    debouncedSave(updatedData); // Debounced 함수 실행
  };

  const openPreview = () => {
    if (isMobile) {
      setIsPreviewVisible(true);
    } else {
      router.push('/resume/preview');
    }
  };

  const closePreview = () => setIsPreviewVisible(false);

  const handleReset = () => {
    dispatch(resetResume());
  };

  const container = `container max-w-default mx-auto p-14 relative`;
  
  return (
    <div className={container}>
      {!isPreviewVisible && (
        <>
          <Profile profile={profileData} onChange={handleInputChange} />
          <PersonalInfoForm />
        </>
      )}

      {isMobile && isPreviewVisible && (
        <div className="fixed inset-0 bg-white z-50">
          <button onClick={closePreview} className="p-4 text-xl">
            뒤로가기
          </button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 border-t flex justify-center items-center gap-4 z-50 max-w-md mx-auto">
        <button onClick={openPreview} className="bg-blue-500 text-white p-2 rounded">미리보기</button>
        <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded">임시 저장</button>
        <button onClick={handleReset} className="bg-red-500 text-white p-2 rounded">서식 초기화</button>
      </div>
    </div>
  );
};

export default Resume;
