import React, { useEffect, useCallback, useRef } from 'react';
import PhotoUploader from './PhotoUploader';
import useProfileStore from '@/store/profileStore';

const Profile = () => {
	const { profile, isLoading, error, loadProfile, updateProfile, updateProfileImage } = useProfileStore();
	const textareaRef = useRef(null);

	const autoResize = useCallback(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, []);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	useEffect(() => {
		autoResize();
	}, [autoResize]);

	const handleChange = useCallback((field, value) => {
		updateProfile(field, value);
	}, [updateProfile]);

  const handleImageChange = useCallback((imageData) => {
    updateProfileImage(imageData);
  }, [updateProfileImage]);

	if (isLoading) {
		return <div>프로필 로딩 중...</div>;
	}

	if (error) {
		return <div>에러 발생: {error}</div>;
	}

	return (
		<section className="profile-container">
			<div className="profile-title">
				<textarea
					className='profile-text-area-title leading-normal'
					value={profile.title || ''}
					onChange={(e) => handleChange('title', e.target.value)}
					placeholder={`간단한 제목을 쓰거나 인사를 해주세요.\n두 줄로 쓰는 것이 가장 보기에 좋습니다.`}
				/>
				<PhotoUploader 
					onImageChange={handleImageChange} 
					currentImage={profile.imageUrl} 
				/>
			</div>
			<textarea
        ref={textareaRef}
        className='profile-text-area-paragraph flex self-center'
        value={profile.paragraph || ''}
				rows={3}
        onChange={(e) => {
          handleChange('paragraph', e.target.value);
          autoResize();
        }}
        placeholder={`이력서는 읽은 지 10초 이내에 첫인상이 결정된다고 합니다.\n나를 나타내는 간결하고 멋진 슬로건과 입사포부, 나의 특장점 등.\n그것이 무엇이든 가장 당신다운 것을 이 곳에 작성해보세요.`}
      />
		</section>
	);
};

export default Profile;