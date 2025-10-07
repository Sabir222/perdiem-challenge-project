'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type ThemeContextType = {
  themeColor: string;
  setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColor] = useState('#3b82f6'); // Default theme color

  // Initialize theme from store info if available
  useEffect(() => {
    // Sync CSS custom properties so Tailwind styles can consume runtime theme color
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--brand', themeColor);
      // Compute readable on-brand and soft variants
      // Fallbacks are fine; designers can refine later
      document.documentElement.style.setProperty('--brand-foreground', '#ffffff');
      document.documentElement.style.setProperty('--brand-soft', themeColor + '20');
    }
  }, []);

  // Reflect updates to themeColor at runtime
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--brand', themeColor);
    }
  }, [themeColor]);

  const value = {
    themeColor,
    setThemeColor
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}