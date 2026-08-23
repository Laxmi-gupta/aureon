import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme.store';

/** Keeps the `.dark` class on <html> in sync with the theme store. Call once near the app root. */
export function useThemeSync() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);
}

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  return { theme, toggleTheme, setTheme };
}
