// Configurações do projeto React
export const APP_CONFIG = {
  name: 'Projeto Aduaneiro',
  version: '1.0.0',
  description: 'Sistema web para gestão de processos aduaneiros',
  author: 'Erick Bortoloti',
  repository: 'https://github.com/ErickFbort/ProjetoAduaneiro'
};

// Configurações de API
export const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.projetoaduaneiro.com' 
    : 'http://localhost:5000',
  endpoints: {
    terminals: '/api/terminals',
    favorites: '/api/favorites',
    users: '/api/users'
  }
};

// Configurações de animação
export const ANIMATION_CONFIG = {
  cardSwap: {
    defaultOptions: {
      cardDistance: 80,
      verticalDistance: 90,
      delay: 4000,
      pauseOnHover: true,
      skewAmount: 8,
      easing: 'elastic' as const,
      width: 450,
      height: 320
    }
  }
};

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  enableLogs: process.env.NODE_ENV === 'development',
  enableReactDevTools: process.env.NODE_ENV === 'development',
  enableHotReload: process.env.NODE_ENV === 'development'
};
