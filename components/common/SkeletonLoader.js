import React from 'react';
import { skeleton } from '@/styles/constLayout';
import { combineClasses } from '@/styles/constLayout';

const SkeletonLoader = () => {
  return (
    <div className={skeleton.container}>
      <div className={combineClasses(skeleton.base, skeleton.profile)}></div>
      <div className={combineClasses(skeleton.base, skeleton.userInfo)}></div>
      <div className={combineClasses(skeleton.base, skeleton.section)}></div>
      <div className={combineClasses(skeleton.base, skeleton.section)}></div>
      <div className={combineClasses(skeleton.base, skeleton.section)}></div>
    </div>
  );
};

export default SkeletonLoader;
