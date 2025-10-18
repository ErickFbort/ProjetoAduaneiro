import React from 'react';
import './LoadingSpinner.css';

interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'avatar' | 'button';
  lines?: number;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  lines = 3,
  className = '',
  width,
  height
}) => {
  const style = {
    width: width || '100%',
    height: height || 'auto'
  };

  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`skeleton-text ${className}`} style={style}>
            {Array.from({ length: lines }, (_, index) => (
              <div
                key={index}
                className={`skeleton skeleton-text ${
                  index === lines - 1 ? 'skeleton-text--short' : 
                  index % 2 === 0 ? 'skeleton-text--medium' : 'skeleton-text--long'
                }`}
              />
            ))}
          </div>
        );

      case 'card':
        return (
          <div className={`skeleton-card ${className}`} style={style}>
            <div className="skeleton skeleton-avatar" style={{ marginBottom: '12px' }} />
            <div className="skeleton skeleton-text skeleton-text--long" style={{ marginBottom: '8px' }} />
            <div className="skeleton skeleton-text skeleton-text--medium" style={{ marginBottom: '8px' }} />
            <div className="skeleton skeleton-text skeleton-text--short" />
          </div>
        );

      case 'avatar':
        return (
          <div className={`skeleton skeleton-avatar ${className}`} style={style} />
        );

      case 'button':
        return (
          <div className={`skeleton ${className}`} style={{ ...style, height: '40px', borderRadius: '4px' }} />
        );

      default:
        return <div className={`skeleton ${className}`} style={style} />;
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader;
