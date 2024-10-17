import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className='layout'>
      <div className='skeleton-base skeleton-profile'></div>
      <div className='skeleton-base skeleton-userinfo'></div>
      <div className='skeleton-base skeleton-section'></div>
      <div className='skeleton-base skeleton-section'></div>
      <div className='skeleton-base skeleton-section'></div>
    </div>
  );
};

export default SkeletonLoader;
