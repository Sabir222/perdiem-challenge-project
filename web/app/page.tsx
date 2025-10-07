'use client';

import { useState, useEffect } from 'react';
import { getStoreInfo } from '@/lib/api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { StoreInfo } from '@/lib/types';
import Link from 'next/link';
import Card from '@/app/components/Card';
import Button from '@/app/components/Button';

export default function Home() {
        const [isLocalhost, setIsLocalhost] = useState(false);
        const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        const { user, loading: authLoading, logout } = useAuth();
        const { themeColor, setThemeColor } = useTheme();

        useEffect(() => {
                // Check if we're on localhost and update state
                const checkLocalhost = () => {
                        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                                setIsLocalhost(true);
                                setLoading(false); // Skip store info fetching if localhost
                        } else {
                                setIsLocalhost(false);
                                // Fetch store info for non-localhost
                                const fetchStoreInfo = async () => {
                                        try {
                                                const data = await getStoreInfo();
                                                setStoreInfo(data);
                                                if (data?.theme) {
                                                        setThemeColor(data.theme);
                                                }
                                        } catch (err) {
                                                setError('Failed to load store information');
                                                console.error(err);
                                        } finally {
                                                setLoading(false);
                                        }
                                };

                                fetchStoreInfo();
                        }
                };

                checkLocalhost();
        }, [setThemeColor]);

        // localhost select store
        if (isLocalhost) {
                return (
                        <div className="surface py-16">
                                <div className="text-center mb-8">
                                        <h1 className="text-3xl font-bold">Welcome to Perdiemin</h1>
                                        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>Please select a store to continue</p>
                                </div>
                                <Card className="max-w-md mx-auto text-center">
                                        <div className="flex flex-col gap-4">
                                                <Button onClick={() => window.location.href = 'http://a.localhost:3000'}>
                                                        Go to Store A
                                                </Button>
                                                <Button onClick={() => window.location.href = 'http://b.localhost:3000'} variant="outline">
                                                        Go to Store B
                                                </Button>
                                        </div>
                                </Card>
                        </div>
                );
        }

        // loading
        if (loading) {
                return (
                        <div className="flex items-center justify-center py-24">
                                <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
                                        <p className="mt-4" style={{ color: 'var(--muted-foreground)' }}>Loading store information...</p>
                                </div>
                        </div>
                );
        }

        // error
        if (error) {
                return (
                        <div className="flex items-center justify-center py-24">
                                <Card className="max-w-md w-full text-center">
                                        <div className="text-red-500 text-2xl mb-4">⚠️</div>
                                        <h2 className="text-xl font-bold mb-2">Error Loading Store</h2>
                                        <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>{error}</p>
                                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                                </Card>
                        </div>
                );
        }

        // Main page 
        return (
                <div className="py-16">
                        <Card className="max-w-lg mx-auto text-center">
                                <h1 className="text-3xl font-bold mb-2">{storeInfo?.name || 'Welcome'}</h1>
                                <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>
                                        {storeInfo?.welcome_message || 'Multi-tenant application'}
                                </p>
                                <div className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                                        Store: {storeInfo?.slug || 'N/A'} | Subdomain: {typeof window !== 'undefined' ? window.location.hostname : 'localhost'}
                                </div>
                                <div className="flex items-center justify-center gap-2 mb-8">
                                        <Button
                                                onClick={() => (window.location.href = 'http://a.localhost:3000')}
                                                variant={typeof window !== 'undefined' && window.location.hostname === 'a.localhost' ? 'primary' : 'outline'}
                                        >
                                                Switch to A
                                        </Button>
                                        <Button
                                                onClick={() => (window.location.href = 'http://b.localhost:3000')}
                                                variant={typeof window !== 'undefined' && window.location.hostname === 'b.localhost' ? 'primary' : 'outline'}
                                        >
                                                Switch to B
                                        </Button>
                                </div>
                                {authLoading ? (
                                        <div className="flex justify-center">
                                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
                                        </div>
                                ) : user ? (
                                        <div className="space-y-4">
                                                <p className="text-lg font-medium">Hello, <span style={{ color: 'var(--brand)' }}>{user.email}</span>!</p>
                                                <Link href="/profile" className="btn btn-primary">View Profile</Link>
                                        </div>
                                ) : null}
                        </Card>
                </div>
        );
}
