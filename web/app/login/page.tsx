'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const { login } = useAuth();
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
                } catch (err) {
                        setError('An error occurred during login');
                } finally {
                        setLoading(false);
                }
        };

        return (
                <div className="min-h-screen flex flex-col">
                        {/* Theme banner - will be updated dynamically if we can access store theme */}
                        <div className="h-3 w-full bg-blue-500"></div>
                        
                        <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
                                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                                        <div className="p-8">
                                                <div className="text-center">
                                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                                                        <p className="text-gray-500">Sign in to your account</p>
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
                                                                <div className="flex items-center justify-between mb-1">
                                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                                                Password
                                                                        </label>
                                                                </div>
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
                                                                {loading ? 'Signing in...' : 'Sign In'}
                                                        </button>
                                                </form>

                                                <div className="mt-6 text-center text-sm">
                                                        <p className="text-gray-600">
                                                                Don't have an account?{' '}
                                                                <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition">
                                                                        Sign up
                                                                </Link>
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
