// 시스템 기본 다크 모드 설정 감지 함수
const prefersDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const updateDarkModeClass = (isEnabled = null) => {
  if (isEnabled === null) {
    // null일 경우 시스템 설정에 따라 다크 모드 적용
    isEnabled = prefersDarkMode();
  }

  localStorage.setItem('darkMode', isEnabled ? 'enabled' : 'disabled');
  document.documentElement.classList.toggle('dark', isEnabled);
};

// 초기 로드 시 다크 모드 설정 적용 함수
export const initializeDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode');
  const isEnabled = savedMode === 'enabled' || (savedMode === null && prefersDarkMode());
  updateDarkModeClass(isEnabled);
};