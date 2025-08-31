import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: 'default' | 'muted' | 'primary' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const backgroundClasses = {
  default: 'bg-background',
  muted: 'bg-muted/30',
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground'
};

const paddingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'section-padding',
  xl: 'py-24 lg:py-32'
};

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  containerClassName,
  background = 'default',
  padding = 'lg',
  containerSize = 'xl',
  ...props
}) => {
  return (
    <section 
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      <Container size={containerSize} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
};