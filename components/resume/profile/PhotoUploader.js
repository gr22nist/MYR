import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PhotoAdd, PhotoRemove } from '@/components/icons/IconSet';
import { getItem, addItem, deleteItem } from '@/utils/indexedDB';  // deleteItem 추가

const PhotoUploader = ({ onImageChange }) => {
  const [photo, setPhoto] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const savedPhoto = await getItem('profilePhotos', 'profilePhoto');
        if (savedPhoto) {
          setPhoto(savedPhoto);
        }
      } catch (err) {
        console.error('사진 불러오기 실패:', err);
      }
    };

    loadPhoto();
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
        await addItem('profilePhotos', 'profilePhoto', imageData);
        setPhoto(imageData);
        setIsLoading(false);
        onImageChange(imageData);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('사진 업로드 실패:', err);
      setError('사진 업로드에 실패했습니다.');
      setIsLoading(false);
    }
  };

  const handlePhotoDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteItem('profilePhotos', 'profilePhoto');  // 'profilePhoto' 키 사용
      setPhoto(null);
      onImageChange(null);
      setIsLoading(false);
    } catch (err) {
      console.error('사진 삭제 실패:', err);
      setError('사진 삭제에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center flex-col">
      <div
        className={`relative w-[110px] h-[144px] overflow-hidden cursor-pointer rounded-md ${
          !photo ? 'border border-gray-300' : ''
        }`}
        onMouseEnter={() => photo && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {photo ? (
          <div className="relative w-full h-full">
            <Image
              src={photo}
              alt="Profile"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <label htmlFor="photo-upload" className="w-full h-full flex items-center justify-center bg-gray-100 cursor-pointer">
            <PhotoAdd className="w-8 h-8 text-gray-400" />
          </label>
        )}
        {photo && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <button onClick={handlePhotoDelete}>
              <PhotoRemove className="w-8 h-8 text-white" />
            </button>
          </div>
        )}
      </div>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      {isLoading && <p>사진 처리 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default PhotoUploader;
