'use client';

import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
};

export default function Input({ label, hint, error, id, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
          {label}
        </label>
      )}
      <input id={id} className={["input", error ? 'border-red-400' : '', className].filter(Boolean).join(' ')} {...props} />
      {hint && !error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}


