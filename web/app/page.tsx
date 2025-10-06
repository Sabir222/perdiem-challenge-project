'use client';

import { useState, useEffect } from 'react';
import { getStoreInfo } from '@/lib/api';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';

export default function Home() {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

        if (isLocalhost) {
                return (
                        <div className="min-h-screen flex flex-col bg-gray-50">
                                <div className="h-3 w-full bg-gray-300"></div>

                                <div className="p-4 bg-white bg-opacity-90 backdrop-blur-sm border-b shadow-sm">
                                        <div className="max-w-4xl mx-auto flex justify-center items-center">
                                                <span className="text-sm text-gray-600 font-medium">Select a store</span>
                                        </div>
                                </div>

                                <main className="flex-grow flex flex-col items-center justify-center p-6">
                                        <div className="max-w-md w-full text-center">
                                                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
                                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Perdiemin</h1>
                                                        <p className="text-gray-600 mb-8">Please select a store to continue</p>

                                                        <div className="flex flex-col gap-4">
                                                                <button
                                                                        onClick={() => window.location.href = 'http://a.localhost:3000'}
                                                                        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition text-lg font-medium shadow-md"
                                                                >
                                                                        Go to Store A
                                                                </button>
                                                                <button
                                                                        onClick={() => window.location.href = 'http://b.localhost:3000'}
                                                                        className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition text-lg font-medium"
                                                                >
                                                                        Go to Store B
                                                                </button>
                                                        </div>
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
                return (
                        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                                        <p className="text-gray-600">Loading store information...</p>
                                </div>
                        </div>
                );
        }

        if (error) {
                return (
                        <div className="flex items-center justify-center min-h-screen bg-gray-50">
                                <div className="h-3 w-full bg-red-500"></div>

                                <div className="text-center p-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-md max-w-md border border-gray-200">
                                        <div className="text-red-500 text-2xl mb-4">⚠️</div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Store</h2>
                                        <p className="text-gray-600 mb-4">{error}</p>
                                        <button
                                                onClick={() => window.location.reload()}
                                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                        >
                                                Try Again
                                        </button>
                                </div>
                        </div>
                );
        }

        return (
                <div className="min-h-screen flex flex-col bg-gray-50">
                        <div
                                className="h-3 w-full"
                                style={{ backgroundColor: storeInfo?.theme || '#3b82f6' }}
                        ></div>

                        <div className="p-4 bg-white bg-opacity-90 backdrop-blur-sm border-b shadow-sm">
                                <div className="max-w-4xl mx-auto flex justify-between items-center">
                                        <span className="text-sm text-gray-600 font-medium">
                                                Store: {storeInfo?.slug || 'N/A'}
                                        </span>
                                        <div className="flex gap-2">
                                                <button
                                                        onClick={() => window.location.href = 'http://a.localhost:3000'}
                                                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${window.location.hostname === 'a.localhost'
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                                }`}
                                                >
                                                        Switch to A
                                                </button>
                                                <button
                                                        onClick={() => window.location.href = 'http://b.localhost:3000'}
                                                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${window.location.hostname === 'b.localhost'
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                                }`}
                                                >
                                                        Switch to B
                                                </button>
                                        </div>
                                </div>
                        </div>

                        <main className="flex-grow flex flex-col items-center justify-center p-6">
                                <div className="max-w-md w-full text-center">
                                        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200">
                                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                                        {storeInfo?.name || 'Welcome'}
                                                </h1>
                                                <p className="text-gray-600 mb-4">
                                                        {storeInfo?.welcome_message || 'Multi-tenant application'}
                                                </p>

                                                <div className="text-sm text-gray-500 mb-8">
                                                        Store: {storeInfo?.slug || 'N/A'} | Subdomain: {typeof window !== 'undefined' ? window.location.hostname : 'localhost'}
                                                </div>

                                                {authLoading ? (
                                                        <div className="flex justify-center">
                                                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                                        </div>
                                                ) : user ? (
                                                        <div className="space-y-4">
                                                                <p className="text-lg font-medium">Hello, <span className="text-blue-600">{user.email}</span>!</p>
                                                                <div className="flex flex-col gap-3">
                                                                        <Link
                                                                                href="/profile"
                                                                                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
                                                                        >
                                                                                View Profile
                                                                        </Link>
                                                                        <button
                                                                                onClick={() => {
                                                                                        logout();
                                                                                        window.location.reload();
                                                                                }}
                                                                                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-medium"
                                                                        >
                                                                                Logout
                                                                        </button>
                                                                </div>
                                                        </div>
                                                ) : (
                                                        <div className="flex flex-col gap-4">
                                                                <Link
                                                                        href="/login"
                                                                        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
                                                                >
                                                                        Login
                                                                </Link>
                                                                <Link
                                                                        href="/signup"
                                                                        className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-medium"
                                                                >
                                                                        Create Account
                                                                </Link>
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </main>
                </div>
        );
}
