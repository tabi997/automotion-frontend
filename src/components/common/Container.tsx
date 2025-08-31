import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

const sizeClasses = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none'
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'xl',
  padding = true
}) => {
  return (
    <div className={cn(
      'mx-auto',
      sizeClasses[size],
      padding && 'container-padding',
      className
    )}>
      {children}
    </div>
  );
};