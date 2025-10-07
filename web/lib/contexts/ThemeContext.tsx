'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type ThemeContextType = {
        themeColor: string;
        setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
        const [themeColor, setThemeColor] = useState('#7e7e7e'); // Default theme color

        useEffect(() => {
                if (typeof document !== 'undefined') {
                        document.documentElement.style.setProperty('--brand', themeColor);
                        document.documentElement.style.setProperty('--brand-foreground', '#ffffff');
                        document.documentElement.style.setProperty('--brand-soft', themeColor + '20');
                }
        }, []);

        // change color without refreshing the page
        useEffect(() => {
                if (typeof document !== 'undefined') {
                        document.documentElement.style.setProperty('--brand', themeColor);
                }
        }, [themeColor]);
        // mke these available for everything inside the context
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
