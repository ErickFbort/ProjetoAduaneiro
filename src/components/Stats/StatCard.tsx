import React, { useEffect, useRef, useState } from 'react';
import { StatCardProps } from '../../types/stats';
import './StatCard.css';

const StatCard: React.FC<StatCardProps> = ({
  stat,
  onCardClick,
  className = '',
  animated = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  // Animação de contagem
  useEffect(() => {
    if (!isVisible) return;

    let currentValue = 0;
    const targetValue = stat.value;
    const increment = targetValue / 50; // 50 steps
    const duration = 1500; // 1.5 seconds
    const stepDuration = duration / 50;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(currentValue));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, stat.value]);

  // Intersection Observer para animação de entrada
  useEffect(() => {
    if (!animated || !cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            entry.target.classList.add('animated');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [animated]);

  const handleClick = () => {
    onCardClick?.(stat.id);
  };

  const getColorClass = (color: string) => {
    const colorMap = {
      primary: 'stat-primary',
      success: 'stat-success',
      info: 'stat-info',
      warning: 'stat-warning',
      danger: 'stat-danger'
    };
    return colorMap[color as keyof typeof colorMap] || 'stat-primary';
  };

  const getAnimationClass = () => {
    if (!animated) return '';
    return `animate-on-scroll fade-in-${stat.animationDirection} delay-${stat.animationDelay}`;
  };

  return (
    <div
      ref={cardRef}
      className={`stat-card ${getColorClass(stat.color)} ${getAnimationClass()} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="stat-icon">
        <i className={`fas ${stat.icon} pulse`}></i>
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{displayValue}</h3>
        <p className="stat-label">{stat.label}</p>
      </div>
    </div>
  );
};

export default StatCard;
