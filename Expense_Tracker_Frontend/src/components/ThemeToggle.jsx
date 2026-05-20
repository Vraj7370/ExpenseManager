import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getTheme, toggleTheme } from '../utils/theme';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`fixed bottom-5 right-5 z-[100] inline-flex items-center justify-center w-11 h-11 rounded-full border shadow-md transition-colors ${
        isDark
          ? 'border-slate-600 bg-slate-800 text-amber-300 hover:bg-slate-700'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
      }`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
