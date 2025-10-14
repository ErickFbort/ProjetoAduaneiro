export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  content: string;
  source: string;
  version?: string;
  type?: 'feature' | 'bugfix' | 'improvement' | 'security' | 'maintenance';
}

export interface NewsData {
  paclog: NewsItem[];
  linkedin: NewsItem[];
  sistema: NewsItem[];
}

export interface NewsTabsProps {
  data: NewsData;
  onRefresh?: () => void;
  onForceRefreshLinkedIn?: () => void;
  autoRotateInterval?: number;
  className?: string;
}

export interface NewsTab {
  id: 'paclog' | 'linkedin' | 'sistema';
  label: string;
  icon: string;
  color: string;
}
