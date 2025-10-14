export interface Terminal {
  id: string;
  name: string;
  status: 'Ativo' | 'Inativo' | 'Manutenção';
  phone: string;
  operations: string;
  description?: string;
  icon?: string;
}

export interface CardSwapOptions {
  cardDistance: number;
  verticalDistance: number;
  delay: number;
  pauseOnHover: boolean;
  skewAmount: number;
  easing: 'elastic' | 'power1' | 'power2' | 'back';
  width: number;
  height: number;
}

export interface CardSwapProps {
  terminals: Terminal[];
  onCardClick?: (terminal: Terminal) => void;
  options?: Partial<CardSwapOptions>;
  className?: string;
}
