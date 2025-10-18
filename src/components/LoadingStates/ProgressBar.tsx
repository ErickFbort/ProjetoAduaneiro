import React from 'react';
import './LoadingSpinner.css';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'medium',
  color = 'primary',
  showPercentage = false,
  animated = true,
  className = ''
}) => {
  const progressClass = `progress-bar progress-bar--${size} progress-bar--${color} ${className}`;
  const fillClass = `progress-bar__fill ${animated ? 'progress-bar__fill--animated' : ''}`;

  const getColorClass = (color: string) => {
    switch (color) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'danger': return '#dc3545';
      default: return '#007bff';
    }
  };

  return (
    <div className={progressClass}>
      <div
        className={fillClass}
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          backgroundColor: getColorClass(color)
        }}
      />
      {showPercentage && (
        <span className="progress-bar__text">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
