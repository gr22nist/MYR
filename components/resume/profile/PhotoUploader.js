import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { PhotoAdd, PhotoRemove } from '@/components/icons/IconSet';
import { addImage, deleteImage } from '@/utils/indexedDB';

const PhotoUploader = ({ onImageChange, currentImage }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const isValidImageData = useCallback((data) => {
    return typeof data === 'string' && data.startsWith('data:image');
  }, []);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        if (isValidImageData(imageData)) {
          await addImage('profilePhoto', imageData);
          onImageChange(imageData);  // 부모 컴포넌트에 변경 사항 알림
        } else {
          throw new Error('Invalid image data');
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Photo upload error:', err);
      setError('사진 업로드에 실패했습니다.');
      setIsLoading(false);
    }
  };

  const handlePhotoDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteImage('profilePhoto');
      onImageChange(null);  // 부모 컴포넌트에 변경 사항 알림
      setIsLoading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Photo delete error:', err);
      setError('사진 삭제에 실패했습니다.');
      setIsLoading(false);
    }
  };

  const photoWrapStyles = `
    relative w-[110px] h-[144px] overflow-hidden cursor-pointer rounded-md
    flex items-center justify-center
  `;

  const photoOverlayStyles = `
    absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center
  `;

  const uploadBtnStyles = `
    w-full h-full flex flex-col items-center justify-center bg-mono-f5 cursor-pointer
  `;

  return (
    <div className="flex items-center flex-col">
      <div
        className={photoWrapStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {currentImage && isValidImageData(currentImage) ? (
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              alt="Profile"
              fill
              style={{ objectFit: 'cover' }}
            />
            {isHovered && (
              <div className={photoOverlayStyles}>
                <button onClick={handlePhotoDelete}>
                  <PhotoRemove className="w-8 h-8 text-white" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <label htmlFor="photo-upload" className={uploadBtnStyles}>
            {isHovered ? (
              <PhotoAdd className="w-8 h-8 text-mono-99" />
            ) : (
              <p className="text-xs text-center text-mono-99 leading-normal">
                사진 첨부가 <br />꼭 필요한 곳에만<br />사용해보세요<br /><br /> 110*140
              </p>
            )}
          </label>
        )}
      </div>
      <input
        id="photo-upload"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      {isLoading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default PhotoUploader;
