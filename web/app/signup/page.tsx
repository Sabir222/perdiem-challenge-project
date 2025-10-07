'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/app/components/Card';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';

export default function Signup() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const { signup } = useAuth();
        const { themeColor } = useTheme();
        const router = useRouter();

        const handleSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                setLoading(true);
                setError('');

                try {
                        const result = await signup(email, password);
                        if (result.success) {
                                router.push('/');
                        } else {
                                setError(result.error || 'Signup failed');
                        }
                } catch (err: unknown) {
                        const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup';
                        setError(errorMessage);
                } finally {
                        setLoading(false);
                }
        };

        return (
                <div className="py-16">
                        <Card className="w-full max-w-md mx-auto">
                                <div className="text-center">
                                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                                        <p style={{ color: 'var(--muted-foreground)' }}>Sign up to get started</p>
                                </div>

                                {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-center">{error}</div>}

                                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required label="Email address" />
                                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required label="Password" />
                                        <Button type="submit" disabled={loading} fullWidth>
                                                {loading ? 'Creating account...' : 'Create Account'}
                                        </Button>
                                </form>

                                <div className="mt-6 text-center text-sm space-y-2">
                                        <p style={{ color: 'var(--muted-foreground)' }}>
                                                Already have an account?{' '}
                                                <Link href="/login" className="font-semibold" style={{ color: 'var(--brand)' }}>
                                                        Sign in
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
