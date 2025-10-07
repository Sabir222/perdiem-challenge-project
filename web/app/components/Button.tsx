'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
};

export default function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  const base = 'btn';
  const variantClass =
    variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const classes = [base, variantClass, widthClass, className].filter(Boolean).join(' ');
  return <button className={classes} {...props} />;
}


