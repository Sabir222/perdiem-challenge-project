'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const { signup } = useAuth();
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
                } catch (err) {
                        setError('An error occurred during signup');
                } finally {
                        setLoading(false);
                }
        };

        return (
                <div className="flex items-center justify-center min-h-screen">
                        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <h1 className="text-2xl font-bold text-center">Sign Up</h1>

                                {error && <div className="text-red-500 text-center">{error}</div>}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                                <label htmlFor="email" className="block text-sm font-medium mb-1">
                                                        Email
                                                </label>
                                                <input
                                                        id="email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                                                />
                                        </div>

                                        <div>
                                                <label htmlFor="password" className="block text-sm font-medium mb-1">
                                                        Password
                                                </label>
                                                <input
                                                        id="password"
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                                                />
                                        </div>

                                        <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                                {loading ? 'Creating account...' : 'Sign Up'}
                                        </button>
                                </form>

                                <div className="text-center text-sm">
                                        <p>
                                                Already have an account?{' '}
                                                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                        Login
                                                </Link>
                                        </p>
                                </div>
                        </div>
                </div>
        );
}
