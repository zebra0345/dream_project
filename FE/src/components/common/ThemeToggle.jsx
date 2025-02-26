// src/components/common/ThemeToggle.jsx
import { useRecoilState } from 'recoil';
import { themeState } from '../../recoil/atoms/themeAtom';
import { useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  // 테마 변경 시 HTML class 업데이트 및 로컬 스토리지 저장
  useEffect(() => { // useLayoutEffect 고려해봐야함
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 테마 토글 함수
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-theme-gray-light dark:bg-theme-gray-dark"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;