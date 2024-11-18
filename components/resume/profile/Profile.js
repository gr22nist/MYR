import React, { useEffect, useCallback, useRef } from 'react';
import PhotoUploader from './PhotoUploader';
import useProfileStore from '@/store/profileStore';

const Profile = React.memo(function Profile() {
	const { profile, isLoading, error, loadProfile, updateProfile, updateProfileImage } = useProfileStore();
	const textareaRef = useRef(null);
	const placeholderRef = useRef(null);
	
	const placeholderText = {
		title: '간단한 제목을 쓰거나 인사를 해주세요.\n두 줄로 쓰는 것이 가장 보기에 좋습니다.',
		paragraph: '이력서는 읽은 지 10초 이내에 첫인상이 결정된다고 합니다.\n나를 나타내는 간결하고 멋진 슬로건과 입사포부, 나의 특장점 등.\n그것이 무엇이든 가장 당신다운 것을 이 곳에 작성해보세요.'
	};

	const handleResize = useCallback(() => {
		if (!textareaRef.current) return;

		const textarea = textareaRef.current;
		const style = window.getComputedStyle(textarea);
		const lineHeight = 28;
		const paddingTop = parseInt(style.paddingTop);
		const paddingBottom = parseInt(style.paddingBottom);
		
		const lines = textarea.value
			.split('\n')
			.filter(line => line.trim().length > 0)
			.length || 1;

		textarea.style.height = 'auto';
		const contentHeight = Math.max(textarea.scrollHeight - (paddingTop + paddingBottom), lineHeight);
		textarea.style.height = `${contentHeight + paddingTop + paddingBottom}px`;
	}, []);

	const handleChange = useCallback((field, value) => {
		updateProfile(field, value);
		if (field === 'paragraph') {
			handleResize();
		}
	}, [updateProfile, handleResize]);

	useEffect(() => {
		if (!isLoading && profile?.paragraph !== undefined) {
			handleResize();
		}
	}, [isLoading, profile?.paragraph, handleResize]);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	if (isLoading) return null;
	if (error) return <div>에러 발생: {error}</div>;

	return (
		<section className='profile-container'>
			<div className='profile-title-wrap'>
				<div className='profile-title flex items-center'>
					<textarea
						className={`profile-text-area-title ${!profile.title ? 'profile-text-area-empty' : ''}`}
						value={profile.title || ''}
						onChange={(e) => handleChange('title', e.target.value)}
						placeholder={placeholderText.title}
						spellCheck='false'
						aria-label='프로필 제목'
						rows={2}
					/>
				</div>
				<PhotoUploader 
					onImageChange={updateProfileImage} 
					currentImage={profile.imageUrl}
					loading='lazy'
				/>
			</div>
			<textarea
				ref={textareaRef}
				className={`profile-text-area-paragraph ${!profile.paragraph ? 'profile-text-area-empty' : ''}`}
				value={profile.paragraph || ''}
				onChange={(e) => handleChange('paragraph', e.target.value)}
				placeholder={placeholderText.paragraph}
				spellCheck='false'
				aria-label='프로필 내용'
			/>
		</section>
	);
});

Profile.displayName = 'Profile';

export default Profile;
