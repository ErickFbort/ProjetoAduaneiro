import { StatsData } from '../types/stats';

// Dados de exemplo para as estatísticas
export const DEFAULT_STATS_DATA: StatsData = {
  users: 4,
  vehicles: 5,
  entities: 2,
  processes: 0
};

// Função para buscar dados reais das estatísticas
export const fetchStatsData = async (): Promise<StatsData> => {
  try {
    // Em produção, fazer requisição para a API
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }
    return await response.json();
  } catch (error) {
    console.warn('Usando dados padrão para estatísticas:', error);
    return DEFAULT_STATS_DATA;
  }
};

// Função para simular dados dinâmicos (para desenvolvimento)
export const getSimulatedStatsData = (): StatsData => {
  return {
    users: Math.floor(Math.random() * 10) + 1,
    vehicles: Math.floor(Math.random() * 15) + 1,
    entities: Math.floor(Math.random() * 8) + 1,
    processes: Math.floor(Math.random() * 20)
  };
};
