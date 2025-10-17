export interface StatItem {
  id: string;
  value: number;
  label: string;
  icon: string;
  color: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  animationDelay: number;
  animationDirection: 'left' | 'right';
}

export interface StatsData {
  users: number;
  vehicles: number;
  entities: number;
  processes: number;
}

export interface StatsGridProps {
  data: StatsData;
  onStatClick?: (statId: string) => void;
  className?: string;
  animated?: boolean;
}

export interface StatCardProps {
  stat: StatItem;
  onCardClick?: (statId: string) => void;
  className?: string;
  animated?: boolean;
}
