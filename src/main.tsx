import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { CardSwap } from './components/Cards';
import { NewsTabs } from './components/News';
import { UserProfileCard } from './components/UserProfile';
import { StatsGrid } from './components/Stats';
import { Terminal } from './types/terminal';
import { UserProfile, UserProfileUpdate } from './types/user';
import { StatsData } from './types/stats';
import { TERMINALS_DATA } from './constants/terminals';
import { NEWS_DATA } from './constants/news';
import { DEFAULT_STATS_DATA } from './constants/stats';
import { ANIMATION_CONFIG } from './config';
import { useUserIntegration } from './stores';
import { GlobalStateProvider } from './components/GlobalStateProvider';
import { FavoritesManager } from './components/FavoritesManager';
import { runAllTests } from './utils/testGlobalState';

// Função para lidar com clique no terminal
const handleTerminalClick = (terminal: Terminal) => {
  console.log('Terminal clicado:', terminal);
  
  // Aqui você pode implementar a lógica existente
  // Por exemplo, chamar a função viewTerminalDetails se existir
  if (typeof window !== 'undefined' && (window as any).viewTerminalDetails) {
    (window as any).viewTerminalDetails(terminal.id);
  }
};

// Função para lidar com refresh das notícias
const handleNewsRefresh = () => {
  console.log('Atualizando notícias...');
  // Aqui você pode implementar a lógica de refresh
  // Por exemplo, chamar a função refreshNews se existir
  if (typeof window !== 'undefined' && (window as any).refreshNews) {
    (window as any).refreshNews();
  }
};

// Função para forçar refresh do LinkedIn
const handleForceRefreshLinkedIn = () => {
  console.log('Forçando atualização do LinkedIn...');
  // Aqui você pode implementar a lógica de force refresh
  // Por exemplo, chamar a função forceRefreshLinkedIn se existir
  if (typeof window !== 'undefined' && (window as any).forceRefreshLinkedIn) {
    (window as any).forceRefreshLinkedIn();
  }
};

// Funções antigas removidas - agora gerenciadas pelo UserProfileRoot

// Componente para gerenciar estado do usuário com estado global
const UserProfileRoot: React.FC<{ initialUser: UserProfile }> = ({ initialUser }) => {
  const { user, setUser, updateUserLegacy } = useUserIntegration();
  const [localUser, setLocalUser] = useState<UserProfile>(initialUser);

  // Sincronizar com estado global
  useEffect(() => {
    if (user) {
      setLocalUser(user);
    } else {
      setUser(initialUser);
    }
  }, [user]); // Remover dependências problemáticas

  // Função para atualizar o perfil do usuário
  const handleUserProfileUpdate = (updates: UserProfileUpdate) => {
    console.log('Atualizando perfil do usuário:', updates);
    
    // Atualizar estado global
    updateUserLegacy(updates);
    
    // Atualizar elementos do DOM se existirem
    const jobTitleElement = document.getElementById('user-job-title');
    if (jobTitleElement && updates.jobTitle) {
      jobTitleElement.textContent = updates.jobTitle;
    }
    
    // Chamar função existente se disponível
    if (typeof window !== 'undefined' && (window as any).updateUserJobTitle) {
      (window as any).updateUserJobTitle(updates.jobTitle);
    }
    
    console.log('Perfil atualizado com sucesso!');
  };

  // Função para lidar com upload de avatar
  const handleAvatarUpload = async (file: File): Promise<void> => {
    console.log('Fazendo upload do avatar:', file.name);
    
    return new Promise((resolve, reject) => {
      // Simular upload (em produção, enviar para o servidor)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // Atualizar estado global
        updateUserLegacy({ avatar: result });
        
        // Atualizar imagem na sidebar se existir
        const avatarElement = document.getElementById('user-avatar') as HTMLImageElement;
        if (avatarElement) {
          avatarElement.src = result;
        }
        
        console.log('Avatar atualizado com sucesso!');
        resolve();
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  };

  // Expor funções globalmente para uso pelo modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).updateGlobalUserProfile = (updates: UserProfileUpdate) => {
        handleUserProfileUpdate(updates);
      };
      (window as any).uploadGlobalAvatar = (file: File) => {
        return handleAvatarUpload(file);
      };
      
      // Ocultar fallback quando React carregar
      if ((window as any).hideUserProfileFallback) {
        console.log('React carregado, ocultando fallback...');
        (window as any).hideUserProfileFallback();
      }
    }
  }, []);

  return (
    <>
      <FavoritesManager />
      <UserProfileCard
        user={localUser}
        onUpdate={handleUserProfileUpdate}
      />
    </>
  );
};

// Função para inicializar o CardSwap React
export const initCardSwapReact = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container com ID '${containerId}' não encontrado`);
    return;
  }

  const root = createRoot(container);
  
  root.render(
    <CardSwap
      terminals={TERMINALS_DATA}
      onCardClick={handleTerminalClick}
      options={ANIMATION_CONFIG.cardSwap.defaultOptions}
    />
  );

  console.log('CardSwap React inicializado com sucesso!');
};

// Função para inicializar o NewsTabs React
export const initNewsTabsReact = (containerId: string) => {
  console.log('Tentando inicializar NewsTabs React...');
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container com ID '${containerId}' não encontrado`);
    return;
  }

  console.log('Container encontrado:', container);
  console.log('Dados NEWS_DATA:', NEWS_DATA);

  const root = createRoot(container);
  
  root.render(
    <NewsTabs
      data={NEWS_DATA}
      onRefresh={handleNewsRefresh}
      onForceRefreshLinkedIn={handleForceRefreshLinkedIn}
      autoRotateInterval={8000}
    />
  );

  console.log('NewsTabs React inicializado com sucesso!');
};

// Função para lidar com clique em estatística
const handleStatClick = (statId: string) => {
  console.log('Estatística clicada:', statId);
  
  // Aqui você pode implementar a lógica existente
  // Por exemplo, navegar para uma página específica ou abrir um modal
  switch (statId) {
    case 'users':
      // Navegar para página de usuários
      if (typeof window !== 'undefined' && (window as any).navigateToUsers) {
        (window as any).navigateToUsers();
      }
      break;
    case 'vehicles':
      // Navegar para página de veículos
      if (typeof window !== 'undefined' && (window as any).navigateToVehicles) {
        (window as any).navigateToVehicles();
      }
      break;
    case 'entities':
      // Navegar para página de entidades
      if (typeof window !== 'undefined' && (window as any).navigateToEntities) {
        (window as any).navigateToEntities();
      }
      break;
    case 'processes':
      // Navegar para página de processos
      if (typeof window !== 'undefined' && (window as any).navigateToProcesses) {
        (window as any).navigateToProcesses();
      }
      break;
  }
};

// Função para inicializar o StatsGrid React
export const initStatsGridReact = (containerId: string, statsData?: StatsData) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container com ID '${containerId}' não encontrado`);
    return;
  }

  const root = createRoot(container);
  
  // Usar dados fornecidos ou buscar dados padrão
  const data = statsData || DEFAULT_STATS_DATA;
  
  root.render(
    <StatsGrid
      data={data}
      onStatClick={handleStatClick}
      animated={true}
    />
  );

  console.log('StatsGrid React inicializado com sucesso!');
};

// Função para inicializar o UserProfileCard React
export const initUserProfileReact = (containerId: string, userData: UserProfile) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container com ID '${containerId}' não encontrado`);
    return;
  }

  const root = createRoot(container);
  
  root.render(
    <GlobalStateProvider>
      <UserProfileRoot initialUser={userData} />
    </GlobalStateProvider>
  );

  // Ocultar fallback e mostrar React imediatamente
  setTimeout(() => {
    // Ocultar fallback
    const fallbackContainer = document.getElementById('user-profile-fallback');
    if (fallbackContainer) {
      fallbackContainer.classList.remove('show-fallback');
    }
    
    // Mostrar React
    container.classList.add('react-loaded');
  }, 50);

  console.log('UserProfileCard React inicializado com sucesso!');
};

// Auto-inicializar se estiver no dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar sistema de estado global
  console.log('Inicializando sistema de estado global...');
  
  // Executar testes em modo de desenvolvimento
  if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    console.log('🧪 Modo de desenvolvimento detectado, executando testes...');
    setTimeout(() => {
      runAllTests();
    }, 2000);
  }
  
  // Verificar se estamos na página do dashboard
  if (document.querySelector('.terminals-section')) {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      initCardSwapReact('react-card-swap-container');
    }, 1000);
  }
  
  // Verificar se estamos na página do dashboard para notícias
  const newsSection = document.querySelector('.news-section');
  const newsContainer = document.getElementById('react-news-container');
  
  console.log('Verificando seção de notícias...');
  console.log('newsSection encontrado:', !!newsSection);
  console.log('newsContainer encontrado:', !!newsContainer);
  
  if (newsSection && newsContainer) {
    console.log('Seção de notícias encontrada, inicializando React...');
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      try {
        initNewsTabsReact('react-news-container');
        console.log('NewsTabs React inicializado com sucesso!');
      } catch (error) {
        console.error('Erro ao inicializar NewsTabs React:', error);
        // Tentar novamente após um delay
        setTimeout(() => {
          try {
            initNewsTabsReact('react-news-container');
            console.log('NewsTabs React inicializado na segunda tentativa!');
          } catch (retryError) {
            console.error('Erro na segunda tentativa:', retryError);
          }
        }, 2000);
      }
    }, 500);
  } else {
    console.log('Seção de notícias ou container não encontrado');
  }
  
  // Verificar se estamos na página do dashboard para estatísticas
  if (document.querySelector('.stats-grid') || document.querySelector('.dashboard-container') || window.location.pathname === '/') {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      // Buscar dados das estatísticas do DOM existente ou usar dados padrão
      const usersElement = document.getElementById('total-users');
      const vehiclesElement = document.getElementById('total-vehicles');
      const entitiesElement = document.getElementById('total-entities');
      const processesElement = document.getElementById('total-processes');
      
      const statsData: StatsData = {
        users: usersElement ? parseInt(usersElement.textContent || '0') : DEFAULT_STATS_DATA.users,
        vehicles: vehiclesElement ? parseInt(vehiclesElement.textContent || '0') : DEFAULT_STATS_DATA.vehicles,
        entities: entitiesElement ? parseInt(entitiesElement.textContent || '0') : DEFAULT_STATS_DATA.entities,
        processes: processesElement ? parseInt(processesElement.textContent || '0') : DEFAULT_STATS_DATA.processes
      };
      
      initStatsGridReact('react-stats-container', statsData);
    }, 1000);
  }
  
  // Verificar se estamos na página do dashboard para perfil do usuário
  if (document.querySelector('.user-profile-section') || document.querySelector('.dashboard-container') || window.location.pathname === '/') {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      // Criar dados do usuário a partir do DOM ou localStorage
      const userData: UserProfile = {
        id: '1',
        name: document.querySelector('.user-name')?.textContent || 'Usuário',
        email: 'usuario@exemplo.com',
        jobTitle: localStorage.getItem('user_job_title') || undefined,
        avatar: localStorage.getItem('user_avatar') || undefined,
        department: localStorage.getItem('user_department') || undefined,
        lastLogin: new Date().toISOString()
      };
      
      initUserProfileReact('react-user-profile-container', userData);
    }, 1000);
  }
});

// Exportar para uso global
if (typeof window !== 'undefined') {
  (window as any).initCardSwapReact = initCardSwapReact;
  (window as any).initNewsTabsReact = initNewsTabsReact;
  (window as any).initUserProfileReact = initUserProfileReact;
  (window as any).initStatsGridReact = initStatsGridReact;
}
