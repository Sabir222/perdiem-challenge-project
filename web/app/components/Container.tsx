import React, { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ className?: string }>; 

export default function Container({ children, className }: Props) {
  return <div className={["container-app", className].filter(Boolean).join(' ')}>{children}</div>;
}


