import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme in localStorage, or default to 'light'
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }
    // You could also check for system preference here if desired
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // return prefersDark ? 'dark' : 'light';
    return 'light';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove the old theme class
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    // Add the new theme class
    root.classList.add(theme);

    // Save the new theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, toggleTheme];
}
