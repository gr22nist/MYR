import React from 'react';
import CreatePreview from '@/components/preview/CreatePreview'; // 미리보기 컴포넌트

const ResumePreview = () => {
  return (
    <div className="container max-w-default p-14">
      <CreatePreview />  {/* 실제 미리보기 컴포넌트를 여기서 사용 */}
    </div>
  );
};

export default ResumePreview;
