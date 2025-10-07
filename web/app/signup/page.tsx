'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
                <div className="min-h-screen flex flex-col">
                        <div 
                                className="h-3 w-full" 
                                style={{ backgroundColor: themeColor }}
                        ></div>
                        
                        <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
                                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                                        <div className="p-8">
                                                <div className="text-center">
                                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                                                        <p className="text-gray-500">Sign up to get started</p>
                                                </div>

                                                {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-center">{error}</div>}

                                                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                                        <div>
                                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Email address
                                                                </label>
                                                                <input
                                                                        id="email"
                                                                        type="email"
                                                                        value={email}
                                                                        onChange={(e) => setEmail(e.target.value)}
                                                                        required
                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                                />
                                                        </div>

                                                        <div>
                                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Password
                                                                </label>
                                                                <input
                                                                        id="password"
                                                                        type="password"
                                                                        value={password}
                                                                        onChange={(e) => setPassword(e.target.value)}
                                                                        required
                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                                />
                                                        </div>

                                                        <button
                                                                type="submit"
                                                                disabled={loading}
                                                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                                {loading ? 'Creating account...' : 'Create Account'}
                                                        </button>
                                                </form>

                                                <div className="mt-6 text-center text-sm space-y-2">
                                                        <p className="text-gray-600">
                                                                Already have an account?{' '}
                                                                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition">
                                                                Sign in
                                                        </Link>
                                                        </p>
                                                        <p className="text-gray-600">
                                                                <Link href="/" className="font-semibold text-blue-600 hover:text-blue-500 transition">
                                                                        &larr; Back to Home
                                                                </Link>
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
