import React from 'react';
import './Accessibility.css';

interface SkipLinkProps {
  target: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  target,
  children,
  className = ''
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(target);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={target}
      onClick={handleClick}
      className={`skip-link ${className}`}
    >
      {children}
    </a>
  );
};

export default SkipLink;
