import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '@/redux/slices/resumeSlice';
import PhotoUploader from './PhotoUploader';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { addItem } from '@/utils/indexedDB';  // addItem 추가

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.resume.profile);
  const { getEncryptedItem, addEncryptedItem } = useIndexedDB();

  useEffect(() => {
    const fetchData = async () => {
      const storedTitle = await getEncryptedItem('profileTexts', 'profileTitle');
      const storedParagraph = await getEncryptedItem('profileTexts', 'profileParagraph');
      
      const updatedProfile = { ...profile };
      let hasChanges = false;

      if (storedTitle && storedTitle !== profile.title) {
        updatedProfile.title = storedTitle;
        hasChanges = true;
      }
      if (storedParagraph && storedParagraph !== profile.paragraph) {
        updatedProfile.paragraph = storedParagraph;
        hasChanges = true;
      }

      if (hasChanges) {
        dispatch(updateProfile(updatedProfile));
      }
    };

    fetchData();
  }, [getEncryptedItem, dispatch, profile]);

  const handleChange = (field, value) => {
    const updatedProfile = { ...profile, [field]: value };
    dispatch(updateProfile(updatedProfile));

    if (field === 'title') {
      addEncryptedItem('profileTexts', 'profileTitle', value);
    } else if (field === 'paragraph') {
      addEncryptedItem('profileTexts', 'profileParagraph', value);
    }
  };

  const handleImageChange = (imageData) => {
    addItem('profilePhotos', 'profilePhoto', imageData);  // 'false' 파라미터 제거
    dispatch(updateProfile({ ...profile, imageUrl: imageData })); // Redux 상태 업데이트
  };

  const handleSave = useCallback(async () => {
    try {
      await addEncryptedItem('profileTexts', 'profileTitle', profile.title);
      await addEncryptedItem('profileTexts', 'profileParagraph', profile.paragraph);
      console.log('Profile data saved successfully');
    } catch (error) {
      console.error('Failed to save profile data:', error);
    }
  }, [addEncryptedItem, profile]);

  return (
    <section className="flex flex-col gap-4">
      <div className="relative w-full flex flex-row justify-between items-center gap-4">
        <textarea
          className="p-4 leading-normal bg-mono-f8 text-4xl text-mono-11 font-black h-36 resize-none border-0 focus:border-1 focus:border-mono-cc focus:ring-0 focus:outline-none rounded-lg overflow-hidden flex-grow"
          rows={2}
          value={profile.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="간단한 제목을 쓰거나 인사를 해주세요. 두 줄로 쓰는 것이 가장 보기에 좋습니다."
          spellCheck="false"
        />
        <PhotoUploader onImageChange={handleImageChange} />
      </div>
      <textarea
        className="p-4 leading-normal bg-mono-f8 text-mono-11 font-normal resize-none border-0 focus:border-1 focus:border-mono-cc focus:ring-0 focus:outline-none rounded-lg overflow-hidden mt-4"
        rows={2}
        value={profile.paragraph || ''}
        onChange={(e) => handleChange('paragraph', e.target.value)}
        placeholder="이력서는 읽은 지 10초 이내에 첫인상이 결정된다고 합니다."
        spellCheck="false"
      />
    </section>
  );
};

export default Profile;
