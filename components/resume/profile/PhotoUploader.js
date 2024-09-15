import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PhotoAdd, PhotoRemove } from '@/components/icons/IconSet'; // 아이콘 라이브러리에서 적절히 import 해주세요
import { getImage, addImage, deleteImage } from '@/hooks/useIndexedDB';

const PhotoUploader = () => {
  const [photo, setPhoto] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const savedPhoto = await getImage('profilePhoto');
        if (savedPhoto) {
          setPhoto(savedPhoto);
        }
      } catch (err) {
        console.error('사진 불러오기 실패:', err);
        setError('사진을 불러오는데 실패했습니다.');
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
        await addImage('profilePhoto', imageData);
        setPhoto(imageData);
        setIsLoading(false);
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
      await deleteImage('profilePhoto');
      setPhoto(null);
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
