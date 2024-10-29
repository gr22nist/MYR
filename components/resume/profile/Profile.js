import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import PhotoUploader from './PhotoUploader';
import useProfileStore from '@/store/profileStore';

const Profile = React.memo(() => {
	const { profile, isLoading, error, loadProfile, updateProfile, updateProfileImage } = useProfileStore();
	const textareaRef = useRef(null);
	const placeholderRef = useRef(null);
	const resizeTimeoutRef = useRef(null);

	const placeholderText = useMemo(() => ({
		title: '간단한 제목을 쓰거나 인사를 해주세요.\n두 줄로 쓰는 것이 가장 보기에 좋습니다.',
		paragraph: '이력서는 읽은 지 10초 이내에 첫인상이 결정된다고 합니다.\n나를 나타내는 간결하고 멋진 슬로건과 입사포부, 나의 특장점 등.\n그것이 무엇이든 가장 당신다운 것을 이 곳에 작성해보세요.'
	}), []);

	const calculatePlaceholderHeight = useCallback(() => {
		if (!placeholderRef.current) return 116;
		const style = window.getComputedStyle(placeholderRef.current);
		const lineHeight = parseInt(style.lineHeight);
		const lines = placeholderRef.current.value.split('\n').length;
		return Math.max(lineHeight * lines, 116);
	}, []);

	const autoResize = useCallback(() => {
		if (!textareaRef.current) return;

		if (resizeTimeoutRef.current) {
			cancelAnimationFrame(resizeTimeoutRef.current);
		}

		resizeTimeoutRef.current = requestAnimationFrame(() => {
			const minHeight = calculatePlaceholderHeight();
			textareaRef.current.style.height = 'auto';
			const newHeight = Math.max(textareaRef.current.scrollHeight, minHeight);
			textareaRef.current.style.height = `${newHeight}px`;
		});
	}, [calculatePlaceholderHeight]);

	const handleChange = useCallback((field, value) => {
		requestAnimationFrame(() => {
			updateProfile(field, value);
			if (field === 'paragraph') {
				autoResize();
			}
		});
	}, [updateProfile, autoResize]);

	const handleImageChange = useCallback((imageData) => {
		updateProfileImage(imageData);
	}, [updateProfileImage]);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	useEffect(() => {
		if (!isLoading) {
			autoResize();
		}
	}, [isLoading, autoResize]);

	useEffect(() => {
		const debouncedResize = () => {
			if (resizeTimeoutRef.current) {
				cancelAnimationFrame(resizeTimeoutRef.current);
			}
			resizeTimeoutRef.current = requestAnimationFrame(autoResize);
		};

		window.addEventListener('resize', debouncedResize, { passive: true });
		
		return () => {
			window.removeEventListener('resize', debouncedResize);
			if (resizeTimeoutRef.current) {
				cancelAnimationFrame(resizeTimeoutRef.current);
			}
		};
	}, [autoResize]);

	// 성능 측정 (개발 모드에서만)
	// useEffect(() => {
	// 	if (process.env.NODE_ENV === 'development' && window.performance) {
	// 		const observer = new PerformanceObserver((list) => {
	// 			const entries = list.getEntries();
	// 			entries.forEach(entry => {
	// 				console.log(`${entry.name}: ${entry.startTime}ms`);
	// 			});
	// 		});
	// 		observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
	// 		return () => observer.disconnect();
	// 	}
	// }, []);

	if (isLoading) return null;
	if (error) return <div>에러 발생: {error}</div>;

	return (
		<section className='profile-container'>
			<div className='profile-title flex items-stretch'>
				<div className='flex-grow flex items-center'>
					<textarea
						className={`profile-text-area-title ${!profile.title ? 'profile-text-area-empty' : ''}`}
						value={profile.title || ''}
						onChange={(e) => handleChange('title', e.target.value)}
						placeholder={placeholderText.title}
						spellCheck='false'
						aria-label='프로필 제목'
					/>
				</div>
				<PhotoUploader 
					onImageChange={handleImageChange} 
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
			<textarea
				ref={placeholderRef}
				className='hidden'
				value={placeholderText.paragraph}
				readOnly
				aria-hidden='true'
			/>
		</section>
	);
});

Profile.displayName = 'Profile';

export default Profile;
