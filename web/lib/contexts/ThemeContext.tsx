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
    // In a real implementation, you might fetch theme from store info
    // For now, we'll keep the default or allow updates via setThemeColor
  }, []);

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