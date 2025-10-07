'use client';

import { useState, useEffect } from 'react';
import { getProfile } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/app/components/Card';

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
                return (
                        <div className="flex items-center justify-center py-24">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
                        </div>
                );
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
                <div className="py-16">
                        <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
                        <Card className="max-w-2xl mx-auto mb-6">
                                <div className="grid grid-cols-1 gap-4">
                                        <div>
                                                <h2 className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>Email</h2>
                                                <p className="text-lg">{profile?.email || user.email}</p>
                                        </div>
                                        <div>
                                                <h2 className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>User ID</h2>
                                                <p className="text-lg">{profile?.id || user.id}</p>
                                        </div>
                                        <div>
                                                <h2 className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>Store ID</h2>
                                                <p className="text-lg">{profile?.store_id || user.store_id}</p>
                                        </div>
                                </div>
                        </Card>

                        <div className="flex justify-center">
                                <Link href="/" className="btn btn-primary">Back to Home</Link>
                        </div>
                </div>
        );
}
