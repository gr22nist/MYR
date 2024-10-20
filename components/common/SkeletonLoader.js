import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className='layout'>
      <div className='skeleton skeleton-profile'></div>
      <div className='skeleton skeleton-userinfo'></div>
      <div className='skeleton skeleton-section'></div>
      <div className='skeleton skeleton-section'></div>
      <div className='skeleton skeleton-section'></div>
    </div>
  );
};

export default SkeletonLoader;
