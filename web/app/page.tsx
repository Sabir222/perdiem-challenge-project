'use client';

import { useState, useEffect } from 'react';
import { getStoreInfo } from '@/lib/api';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';

export default function Home() {
  // Check if we're on localhost without subdomain
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  if (isLocalhost) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="p-4 bg-gray-50 border-b">
          <div className="max-w-md mx-auto flex justify-center items-center">
            <span className="text-sm text-gray-600">Select a store</span>
          </div>
        </div>

        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <p className="text-gray-600 mb-8">Please select a store to continue</p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.location.href = 'http://a.localhost:3000'}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition text-lg"
              >
                Go to Store A
              </button>
              <button
                onClick={() => window.location.href = 'http://b.localhost:3000'}
                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition text-lg"
              >
                Go to Store B
              </button>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-gray-500 text-sm">
          <p>Multi-tenant App &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  }

  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    const fetchStoreInfo = async () => {
      setLoading(true);
      try {
        const data = await getStoreInfo();
        setStoreInfo(data);
      } catch (err) {
        setError('Failed to load store information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 bg-gray-50 border-b">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Store: {storeInfo?.slug || 'N/A'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = 'http://a.localhost:3000'}
              className={`text-xs px-2 py-1 rounded ${window.location.hostname === 'a.localhost'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
                }`}
            >
              Switch to A
            </button>
            <button
              onClick={() => window.location.href = 'http://b.localhost:3000'}
              className={`text-xs px-2 py-1 rounded ${window.location.hostname === 'b.localhost'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
                }`}
            >
              Switch to B
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2">
            {storeInfo?.name || 'Welcome'}
          </h1>
          <p className="text-gray-600 mb-4">
            {storeInfo?.welcome_message || 'Multi-tenant application'}
          </p>

          <div className="text-sm text-gray-500 mb-8">
            Store: {storeInfo?.slug || 'N/A'} | Subdomain: {typeof window !== 'undefined' ? window.location.hostname : 'localhost'}
          </div>

          {authLoading ? (
            <p>Loading...</p>
          ) : user ? (
            <div className="space-y-4">
              <p className="text-lg">Hello, {user.email}!</p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/profile"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
