import React, { useEffect, useCallback, useRef } from 'react';
import PhotoUploader from './PhotoUploader';
import useProfileStore from '@/store/profileStore';

const Profile = () => {
	const { profile, isLoading, error, loadProfile, updateProfile, updateProfileImage } = useProfileStore();
	const textareaRef = useRef(null);
	const placeholderRef = useRef(null);

	const calculatePlaceholderHeight = useCallback(() => {
		if (placeholderRef.current) {
			const lineHeight = parseInt(window.getComputedStyle(placeholderRef.current).lineHeight);
			const lines = placeholderRef.current.value.split('\n').length;
			return lineHeight * lines;
		}
		return 116;
	}, []);

	const autoResize = useCallback(() => {
		if (textareaRef.current) {
			const minHeight = calculatePlaceholderHeight();
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, minHeight)}px`;
		}
	}, [calculatePlaceholderHeight]);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	useEffect(() => {
		if (!isLoading) {
			autoResize();
		}
	}, [isLoading, autoResize]);

	useEffect(() => {
		window.addEventListener('resize', autoResize);
		return () => window.removeEventListener('resize', autoResize);
	}, [autoResize]);

	const handleChange = useCallback((field, value) => {
		updateProfile(field, value);
		if (field === 'paragraph') {
			autoResize();
		}
	}, [updateProfile, autoResize]);

	const handleImageChange = useCallback((imageData) => {
		updateProfileImage(imageData);
	}, [updateProfileImage]);

	const placeholderText = `이력서는 읽은 지 10초 이내에 첫인상이 결정된다고 합니다.\n나를 나타내는 간결하고 멋진 슬로건과 입사포부, 나의 특장점 등.\n그것이 무엇이든 가장 당신다운 것을 이 곳에 작성해보세요.`;

	if (isLoading) {
		return null;
	}

	if (error) {
		return <div>에러 발생: {error}</div>;
	}

	return (
		<section className="profile-container">
			<div className="profile-title flex items-stretch">
				<div className="flex-grow flex items-center">
					<textarea
						className={`profile-text-area-title ${!profile.title ? 'profile-text-area-empty' : ''}`}
						value={profile.title || ''}
						onChange={(e) => handleChange('title', e.target.value)}
						placeholder={`간단한 제목을 쓰거나 인사를 해주세요.\n두 줄로 쓰는 것이 가장 보기에 좋습니다.`}
					/>
				</div>
				<PhotoUploader 
					onImageChange={handleImageChange} 
					currentImage={profile.imageUrl} 
				/>
			</div>
			<textarea
				ref={textareaRef}
				className={`profile-text-area-paragraph ${!profile.paragraph ? 'profile-text-area-empty' : ''}`}
				value={profile.paragraph || ''}
				onChange={(e) => handleChange('paragraph', e.target.value)}
				placeholder={placeholderText}
			/>
			<textarea
				ref={placeholderRef}
				className='hidden'
				value={placeholderText}
				readOnly
			/>
		</section>
	);
};

export default Profile;
