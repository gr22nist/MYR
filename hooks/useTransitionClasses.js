import { useState, useEffect } from 'react';

export const useTransitionClasses = (timeout = 300) => {
  const [stage, setStage] = useState('enter');

  useEffect(() => {
    let timer;
    if (stage === 'enter') {
      timer = setTimeout(() => setStage('enterActive'), 20);
    }
    return () => clearTimeout(timer);
  }, [stage]);

  const classNames = {
    enter: 'opacity-0 -translate-y-5',
    enterActive: 'opacity-100 translate-y-0 transition-all duration-300 ease-out',
    exit: 'opacity-100 translate-y-0',
    exitActive: 'opacity-0 -translate-y-5 transition-all duration-300 ease-in',
  };

  return { stage, setStage, classNames };
};
