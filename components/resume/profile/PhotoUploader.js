import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { PhotoAdd, PhotoRemove } from '@/components/icons/IconSet';
import imageCompression from 'browser-image-compression';
import useGlobalStore from '@/store/globalStore';
import { saveProfilePhoto, deleteProfilePhoto } from '@/utils/indexedDB';
import { encryptData } from '@/utils/cryptoUtils';

// 컴포넌트 외부로 이동
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
      const img = new window.Image();  // 'window.Image'를 사용
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
        const imageData = reader.result;  // 전체 data URL을 사용
        // 중복된 접두사 제거
        const cleanImageData = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
        const encryptedImageData = encryptData(cleanImageData);
        await saveProfilePhoto(encryptedImageData);
        onImageChange(imageData);  // 암호화되지 않은 원본 data URL 사용
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
    <div className="flex items-center flex-col">
      <div 
        className="relative w-[110px] h-[144px] overflow-hidden cursor-pointer rounded-md flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {currentImage ? (
          <div className="relative w-full h-full group">
            <Image
              src={currentImage}
              alt="Profile"
              fill
              style={{ objectFit: 'cover' }}
            />
            {isHovered && (
              <div className="absolute inset-0 bg-extrabold bg-opacity-50 flex items-center justify-center transition-opacity">
                <button onClick={handlePhotoDelete}>
                  <PhotoRemove className="w-8 h-8 text-white" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <label htmlFor="photo-upload" className="w-full h-full flex flex-col items-center justify-center bg-mono-f5 cursor-pointer">
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
    </div>
  );
};

export default PhotoUploader;
