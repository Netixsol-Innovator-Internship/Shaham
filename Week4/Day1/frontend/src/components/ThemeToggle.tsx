import React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      <button
        onClick={toggleTheme}
        className="relative p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 group"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div className="relative">
          {theme === 'light' ? (
            <Moon className="w-6 h-6 text-violet-600 group-hover:text-pink-600 transition-colors duration-300" />
          ) : (
            <Sun className="w-6 h-6 text-yellow-500 group-hover:text-orange-500 transition-colors duration-300" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        </div>
      </button>
    </div>
  );
}