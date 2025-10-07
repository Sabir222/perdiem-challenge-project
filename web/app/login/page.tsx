'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/app/components/Card';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';

export default function Login() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const { login } = useAuth();
        const { themeColor } = useTheme();
        const router = useRouter();

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setLoading(true);
                setError('');

                try {
                        const result = await login(email, password);
                        if (result.success) {
                                router.push('/');
                        } else {
                                setError(result.error || 'Login failed');
                        }
                } catch (err: unknown) {
                        const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
                        setError(errorMessage);
                } finally {
                        setLoading(false);
                }
        };

        return (
                <div className="py-16">
                        <Card className="w-full max-w-md mx-auto">
                                <div className="text-center">
                                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                                        <p style={{ color: 'var(--muted-foreground)' }}>Sign in to your account</p>
                                </div>

                                {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-center">{error}</div>}

                                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required label="Email address" />
                                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required label="Password" />
                                        <Button type="submit" disabled={loading} fullWidth>
                                                {loading ? 'Signing in...' : 'Sign In'}
                                        </Button>
                                </form>

                                <div className="mt-6 text-center text-sm space-y-2">
                                        <p style={{ color: 'var(--muted-foreground)' }}>
                                                Don&apos;t have an account?{' '}
                                                <Link href="/signup" className="font-semibold" style={{ color: 'var(--brand)' }}>
                                                        Sign up
                                                </Link>
                                        </p>
                                        <p style={{ color: 'var(--muted-foreground)' }}>
                                                <Link href="/" className="font-semibold" style={{ color: 'var(--brand)' }}>
                                                        &larr; Back to Home
                                                </Link>
                                        </p>
                                </div>
                        </Card>
                </div>
        );
}
