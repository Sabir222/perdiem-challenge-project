'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, login as loginApi, signup as signupApi, logout as logoutApi, getProfile } from '@/lib/api';

type AuthContextType = {
        user: any;
        loading: boolean;
        login: (email: string, password: string) => Promise<any>;
        signup: (email: string, password: string) => Promise<any>;
        logout: () => void;
        checkAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
        const [user, setUser] = useState<any>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                const checkAuthStatus = async () => {
                        setLoading(true);
                        if (isAuthenticated()) {
                                try {
                                        const profile = await getProfile();
                                        setUser(profile);
                                } catch (error) {
                                        console.error('Auth check failed:', error);
                                        logout();
                                }
                        }
                        setLoading(false);
                };

                checkAuthStatus();
        }, []);

        const checkAuth = async () => {
                if (isAuthenticated()) {
                        try {
                                const profile = await getProfile();
                                setUser(profile);
                                return true;
                        } catch (error) {
                                console.error('Auth check failed:', error);
                                logout();
                                return false;
                        }
                }
                return false;
        };

        const login = async (email: string, password: string) => {
                try {
                        const result = await loginApi(email, password);
                        if (result.success) {
                                localStorage.setItem('token', result.token);
                                setUser(result.user);
                                return { success: true, user: result.user };
                        } else {
                                return { success: false, error: result.error || 'Login failed' };
                        }
                } catch (error) {
                        return { success: false, error: 'Network error' };
                }
        };

        const signup = async (email: string, password: string) => {
                try {
                        const result = await signupApi(email, password);
                        if (result.success) {
                                localStorage.setItem('token', result.token);
                                setUser(result.user);
                                return { success: true, user: result.user };
                        } else {
                                return { success: false, error: result.error || 'Signup failed' };
                        }
                } catch (error) {
                        return { success: false, error: 'Network error' };
                }
        };

        const logout = () => {
                logoutApi();
                setUser(null);
        };

        const value = {
                user,
                loading,
                login,
                signup,
                logout,
                checkAuth,
        };

        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
        const context = useContext(AuthContext);
        if (context === undefined) {
                throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
}
