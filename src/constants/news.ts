import { NewsData, NewsTab } from '../types/news';

// Dados das notícias
export const NEWS_DATA: NewsData = {
  paclog: [
    {
      id: 1,
      title: 'Nova funcionalidade de relatórios avançados',
      date: '2024-01-22',
      category: 'Funcionalidade',
      content: 'Implementamos novos relatórios com filtros avançados e exportação em múltiplos formatos.',
      source: 'Comunicados Pac Log'
    },
    {
      id: 2,
      title: 'Manutenção programada do sistema',
      date: '2024-01-20',
      category: 'Manutenção',
      content: 'Sistema passará por manutenção preventiva no próximo domingo das 02:00 às 06:00.',
      source: 'Comunicados Pac Log'
    }
  ],
  linkedin: [],
  sistema: [
    {
      id: 1,
      title: 'Versão 2.1.0 - Nova funcionalidade de Autorização de Carregamento',
      date: '2024-01-20',
      category: 'Funcionalidade',
      content: 'Implementada nova funcionalidade completa de autorização de carregamento com formulário dinâmico e validações avançadas.',
      source: 'Sistema Aduaneiro',
      version: '2.1.0',
      type: 'feature'
    },
    {
      id: 2,
      title: 'Correção de bugs na interface de processos',
      date: '2024-01-18',
      category: 'Correção',
      content: 'Corrigidos problemas de responsividade e validação de formulários na seção de processos.',
      source: 'Sistema Aduaneiro',
      version: '2.0.8',
      type: 'bugfix'
    },
    {
      id: 3,
      title: 'Melhorias de performance no dashboard',
      date: '2024-01-16',
      category: 'Melhoria',
      content: 'Otimizações realizadas para melhorar o tempo de carregamento do dashboard principal.',
      source: 'Sistema Aduaneiro',
      version: '2.0.7',
      type: 'improvement'
    },
    {
      id: 4,
      title: 'Nova funcionalidade de personalização de cards',
      date: '2024-01-14',
      category: 'Funcionalidade',
      content: 'Usuários agora podem personalizar a ordem dos cards na tela inicial arrastando e soltando.',
      source: 'Sistema Aduaneiro',
      version: '2.0.6',
      type: 'feature'
    }
  ]
};

// Configuração das abas
export const NEWS_TABS: NewsTab[] = [
  {
    id: 'paclog',
    label: 'Pac Log',
    icon: 'fas fa-globe',
    color: '#007bff'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'fab fa-linkedin',
    color: '#0077b5'
  },
  {
    id: 'sistema',
    label: 'Atualizações do Sistema',
    icon: 'fas fa-cog',
    color: '#28a745'
  }
];

// Configuração de ícones para tipos de atualização
export const UPDATE_ICONS = {
  feature: 'star',
  bugfix: 'bug',
  improvement: 'arrow-up',
  security: 'shield-alt',
  maintenance: 'tools'
} as const;

// Configuração de classes para badges
export const UPDATE_BADGE_CLASSES = {
  feature: 'success',
  bugfix: 'warning',
  improvement: 'info',
  security: 'danger',
  maintenance: 'secondary'
} as const;
