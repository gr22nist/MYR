import React from 'react';
import Image from 'next/image';

const ProfilePreview = ({ profile, imageUrl }) => {
  return (
    <div className="flex items-center gap-4">
      {imageUrl && (
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={imageUrl}
            alt="프로필 사진"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold">{profile.title}</h3>
        <p>{profile.paragraph}</p>
      </div>
    </div>
  );
};

export default ProfilePreview;