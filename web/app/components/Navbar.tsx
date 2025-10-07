'use client';

import Link from 'next/link';
import React from 'react';
import Container from './Container';
import Button from './Button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { themeColor } = useTheme();

  return (
    <header className="border-b" style={{ borderColor: 'var(--border)' }}>
      <div style={{ background: themeColor, height: 3 }} />
      <Container className="py-4 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight text-xl" style={{ color: 'var(--foreground)' }}>
          Perdiemin
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Home</Link>
          {user ? (
            <>
              <Link href="/profile" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Profile</Link>
              <Button
                onClick={() => { logout(); location.href = '/'; }}
                variant="outline"
              >Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Login</Link>
              <Link href="/signup" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Signup</Link>
            </>
          )}
        </nav>
      </Container>
    </header>
  );
}


