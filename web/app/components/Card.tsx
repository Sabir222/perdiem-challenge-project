import React, { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{ className?: string }>; 

export default function Card({ children, className }: CardProps) {
  return <div className={["card p-8", className].filter(Boolean).join(' ')}>{children}</div>;
}


