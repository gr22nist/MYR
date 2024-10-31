import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { PhotoAdd, PhotoRemove } from '@/components/icons/IconSet';
import useGlobalStore from '@/store/globalStore';
import { saveProfilePhoto, deleteProfilePhoto } from '@/utils/indexedDB';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const PhotoUploader = ({ onImageChange, currentImage }) => {
  const { showToast } = useGlobalStore();
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);

  const compressImage = useCallback(async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1000,
      useWebWorker: true
    };
    try {
      const imageCompression = (await import('browser-image-compression')).default;
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('이미지 압축 실패:', error);
      showToast({ message: '이미지 압축에 실패했습니다.', type: 'error' });
      return file;
    }
  }, [showToast]);

  const resizeImage = useCallback((file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', 0.7);
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handlePhotoUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast({ message: '지원되지 않는 파일 형식입니다. JPG, PNG, WEBP 형식만 허용됩니다.', type: 'error' });
      return;
    }

    setError(null);

    try {
      const compressedFile = await compressImage(file);
      const resizedBlob = await resizeImage(compressedFile, 110, 144);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        await saveProfilePhoto(imageData);
        onImageChange(imageData);
        showToast({ message: '이미지가 성공적으로 업로드되었습니다.', type: 'success' });
      };
      reader.readAsDataURL(resizedBlob);
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      showToast({
        message: '이미지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.',
        type: 'error'
      });
      setError('이미지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }, [onImageChange, showToast, compressImage, resizeImage]);

  const handlePhotoDelete = useCallback(async () => {
    try {
      const isDeleted = await deleteProfilePhoto();
      if (isDeleted) {
        onImageChange(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        showToast({ message: '이미지가 삭제되었습니다.', type: 'info' });
      } else {
        throw new Error('이미지 삭제 실패');
      }
    } catch (error) {
      console.error('이미지 삭제 중 오류 발생:', error);
      showToast({ message: '이미지 삭제 중 오류가 발생했습니다.', type: 'error' });
    }
  }, [onImageChange, showToast]);

  return (
    <div className='profile-img-container'>
      <div 
        className='profile-img'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {currentImage ? (
          <div>
            <Image
              src={currentImage}
              alt='Profile'
              fill
              classname='object-cover'
            />
            {isHovered && (
              <div className='profile-img-hover'>
                <button onClick={handlePhotoDelete}>
                  <PhotoRemove width={32} height={32} className='text-white' />
                </button>
              </div>
            )}
          </div>
        ) : (
          <label htmlFor='photo-upload' className='profile-img-label'>
            {isHovered ? (
              <PhotoAdd width={32} height={32} className='fill-mono-99' />
            ) : (
              <p className='profile-img-label-text'>
                사진 첨부가 <br />필요한 곳에만<br />사용해보세요
              </p>
            )}
          </label>
        )}
      </div>
      <input
        id='photo-upload'
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handlePhotoUpload}
        className='hidden'
      />
    </div>
  );
};

export default PhotoUploader;
