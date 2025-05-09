'use client';

import { HTMLAttributes } from 'react';
import styles from './Card.module.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  withPadding?: boolean;
  hoverable?: boolean;
  children: React.ReactNode;
}

export function Card({
  withPadding = true,
  hoverable = false,
  children,
  className,
  ...rest
}: CardProps) {
  const cardClasses = [
    styles.card,
    withPadding && styles.withPadding,
    hoverable && styles.hoverable,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children?: React.ReactNode;
}

export function CardHeader({ title, children, className, ...rest }: CardHeaderProps) {
  const headerClasses = [styles.header, className].filter(Boolean).join(' ');
  
  return (
    <div className={headerClasses} {...rest}>
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {children}
    </div>
  );
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardBody({ children, className, ...rest }: CardBodyProps) {
  const bodyClasses = [styles.body, className].filter(Boolean).join(' ');
  
  return (
    <div className={bodyClasses} {...rest}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ children, className, ...rest }: CardFooterProps) {
  const footerClasses = [styles.footer, className].filter(Boolean).join(' ');
  
  return (
    <div className={footerClasses} {...rest}>
      {children}
    </div>
  );
} 