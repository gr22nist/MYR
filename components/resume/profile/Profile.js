import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '@/redux/slices/resumeSlice';
import PhotoUploader from './PhotoUploader';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { getImage } from '@/utils/indexedDB';
import { commonStyles } from '@/styles/constLayout';

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.resume.profile);
  const { getEncryptedItem, addEncryptedItem } = useIndexedDB();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedTitle = await getEncryptedItem('profileTexts', 'profileTitle');
      const storedParagraph = await getEncryptedItem('profileTexts', 'profileParagraph');
      const storedImage = await getImage('profilePhoto');
      
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
      if (storedImage && storedImage !== profile.imageUrl) {
        updatedProfile.imageUrl = storedImage;
        setProfileImage(storedImage);
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

  const handleImageChange = useCallback((imageData) => {
    setProfileImage(imageData);
    dispatch(updateProfile({ ...profile, imageUrl: imageData }));
  }, [dispatch, profile]);

  const textAreaBaseStyle = 'p-4 bg-mono-f5 leading-normal text-mono-11 resize-none border-0 rounded-lg overflow-hidden';
  const textAreaStyle = `${textAreaBaseStyle} ${commonStyles.focusStyle}`;

  return (
    <section className="flex flex-col gap-2">
      <div className="relative w-full flex flex-row justify-between items-center gap-4">
        <textarea
          className={`${textAreaStyle} text-4xl font-black h-36 flex-grow`}
          rows={2}
          value={profile.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={`간단한 제목을 쓰거나 인사를 해주세요.\n두 줄로 쓰는 것이 가장 보기에 좋습니다.`}
          spellCheck="false"
        />
        <PhotoUploader onImageChange={handleImageChange} currentImage={profileImage} />
      </div>
      <textarea
        className={`${textAreaStyle} font-bold h-auto`}
        rows={3}
        value={profile.paragraph || ''}
        onChange={(e) => handleChange('paragraph', e.target.value)}
        placeholder="이력서는 읽은 지 10초 이내에 첫인상이 결정된다고 합니다."
        spellCheck="false"
      />
    </section>
  );
};

export default Profile;
