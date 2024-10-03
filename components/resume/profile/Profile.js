import React, { useEffect, useCallback } from 'react';
import PhotoUploader from './PhotoUploader';
import { commonStyles } from '@/styles/constLayout';
import useProfileStore from '@/store/profileStore';

const Profile = () => {
	const { profile, isLoading, error, loadProfile, updateProfile, updateProfileImage } = useProfileStore();

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

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

	const imageUrl = profile?.imageUrl || '';

	const textAreaBaseStyle = 'p-4 bg-mono-f5 leading-normal text-mono-11 resize-none border-0 rounded-lg overflow-hidden';
	const textAreaStyle = `${textAreaBaseStyle} ${commonStyles.focusStyle}`;

	return (
		<section className="flex flex-col gap-2">
			<div className="relative w-full flex flex-row justify-between items-center gap-4">
				<textarea
					className={`${textAreaStyle} text-4xl font-extrabold h-36 flex-grow`}
					rows={2}
					value={profile.title || ''}
					onChange={(e) => handleChange('title', e.target.value)}
					placeholder={`간단한 제목을 쓰거나 인사를 해주세요.\n두 줄로 쓰는 것이 가장 보기에 좋습니다.`}
					spellCheck="false"
				/>
				<PhotoUploader onImageChange={handleImageChange} currentImage={profile.imageUrl} />
			</div>
			<textarea
				className={`${textAreaStyle} text-lg h-auto`}
				rows={2}
				value={profile.paragraph || ''}
				onChange={(e) => handleChange('paragraph', e.target.value)}
				placeholder={`이력서는 읽은 지 10초 이내에 첫인상이 결정된다고 합니다.\n나를 나타내는 간결하고 멋진 슬로건과 입사포부, 나의 특장점 등. 그것이 무엇이든 가장 당신다운 것을 이 곳에 작성해보세요.`}
				spellCheck="false"
			/>
		</section>
	);
};

export default Profile;
