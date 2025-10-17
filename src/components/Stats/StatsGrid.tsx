import React, { useMemo } from 'react';
import { StatsGridProps, StatItem } from '../../types/stats';
import StatCard from './StatCard';
import './StatsGrid.css';

const StatsGrid: React.FC<StatsGridProps> = ({
  data,
  onStatClick,
  className = '',
  animated = true
}) => {
  // Converter dados para formato de estatísticas
  const stats: StatItem[] = useMemo(() => [
    {
      id: 'users',
      value: data.users,
      label: 'Usuários Ativos',
      icon: 'fa-users',
      color: 'primary',
      animationDelay: 1,
      animationDirection: 'left'
    },
    {
      id: 'vehicles',
      value: data.vehicles,
      label: 'Veículos Cadastrados',
      icon: 'fa-truck',
      color: 'success',
      animationDelay: 2,
      animationDirection: 'left'
    },
    {
      id: 'entities',
      value: data.entities,
      label: 'Entidades Cadastradas',
      icon: 'fa-building',
      color: 'info',
      animationDelay: 3,
      animationDirection: 'right'
    },
    {
      id: 'processes',
      value: data.processes,
      label: 'Processos em Andamento',
      icon: 'fa-chart-line',
      color: 'warning',
      animationDelay: 4,
      animationDirection: 'right'
    }
  ], [data]);

  const handleStatClick = (statId: string) => {
    console.log('Estatística clicada:', statId);
    onStatClick?.(statId);
  };

  return (
    <div className={`stats-grid ${className}`}>
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          stat={stat}
          onCardClick={handleStatClick}
          animated={animated}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
