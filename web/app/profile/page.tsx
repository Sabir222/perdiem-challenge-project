'use client';

import { useState, useEffect } from 'react';
import { getProfile } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Profile() {
        const [profile, setProfile] = useState<User | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        const { user, loading: authLoading } = useAuth();
        const { themeColor } = useTheme();
        const router = useRouter();

        useEffect(() => {
                if (!authLoading && !user) {
                        router.push('/login');
                        return;
                }

                const fetchProfile = async () => {
                        try {
                                const data = await getProfile();
                                setProfile(data);
                        } catch (err) {
                                setError('Failed to load profile');
                                console.error(err);
                        } finally {
                                setLoading(false);
                        }
                };

                if (user) {
                        fetchProfile();
                }
        }, [user, authLoading, router]);

        if (authLoading || loading) {
                return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
        }

        if (error) {
                return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
        }

        if (!user) {
                return (
                        <div className="flex items-center justify-center min-h-screen">
                                <div className="text-center">
                                        <p>You need to be logged in to view this page.</p>
                                        <Link href="/login" className="text-indigo-600 hover:underline mt-4 block">
                                                Login
                                        </Link>
                                </div>
                        </div>
                );
        }

        return (
                <div className="font-sans min-h-screen">
                        <div 
                                className="h-3 w-full" 
                                style={{ backgroundColor: themeColor }}
                        ></div>
                        <div className="p-8 pb-20 gap-16 sm:p-20">
                                <main className="max-w-2xl mx-auto">
                                <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>

                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                                        <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                        <h2 className="text-lg font-semibold text-gray-500">Email</h2>
                                                        <p className="text-xl">{profile?.email || user.email}</p>
                                                </div>

                                                <div>
                                                        <h2 className="text-lg font-semibold text-gray-500">User ID</h2>
                                                        <p className="text-xl">{profile?.id || user.id}</p>
                                                </div>

                                                <div>
                                                        <h2 className="text-lg font-semibold text-gray-500">Store ID</h2>
                                                        <p className="text-xl">{profile?.store_id || user.store_id}</p>
                                                </div>
                                        </div>
                                </div>

                                <div className="flex justify-center">
                                        <Link
                                                href="/"
                                                className="rounded-full border border-solid transition-colors flex items-center justify-center font-medium text-sm h-10 px-6"
                                                style={{ 
                                                        backgroundColor: themeColor, 
                                                        color: 'white',
                                                        borderColor: themeColor
                                                }}
                                        >
                                                Back to Home
                                        </Link>
                                </div>
                        </main>
                </div>
        </div>
        );
}
