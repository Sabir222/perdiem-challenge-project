'use client';

import { useEffect } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function NotFound() {
  const { themeColor } = useTheme();
  
  useEffect(() => {
    // Log the error to the console in development
    console.error('404: Page not found');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Theme banner */}
      <div 
        className="h-3 w-full" 
        style={{ backgroundColor: themeColor }}
      ></div>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <h1 
            className="text-6xl font-bold mb-4"
            style={{ color: themeColor }}
          >
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-lg text-white font-medium shadow-md"
            style={{ backgroundColor: themeColor }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}