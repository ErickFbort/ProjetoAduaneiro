import { useEffect, useCallback } from 'react';
import { useGlobalStore, useUser, useFavorites, useLayout, useNotifications } from '../stores/globalStore';
import { UserProfile, UserProfileUpdate } from '../types/user';

// Hook principal para gerenciar estado global
export const useGlobalState = () => {
  const initializeFromLocalStorage = useGlobalStore(state => state.initializeFromLocalStorage);
  const resetToDefaults = useGlobalStore(state => state.resetToDefaults);
  
  // Inicializar store na montagem do componente
  useEffect(() => {
    initializeFromLocalStorage();
  }, [initializeFromLocalStorage]);
  
  return {
    initializeFromLocalStorage,
    resetToDefaults,
    ...useUser(),
    ...useFavorites(),
    ...useLayout(),
    ...useNotifications()
  };
};

// Hook específico para integração com sistema de favoritos existente
export const useFavoritesIntegration = () => {
  const { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite } = useFavorites();
  
  // Função para migrar favoritos do localStorage para o store
  const migrateFavoritesFromLocalStorage = useCallback(() => {
    console.log('Migrando favoritos do localStorage para o store global...');
    
    // Migrar favoritos do dashboard
    const dashboardFavorites = localStorage.getItem('dashboard_favorites');
    if (dashboardFavorites) {
      try {
        const parsed = JSON.parse(dashboardFavorites);
        console.log('Favoritos do dashboard encontrados:', parsed);
        // O store já carrega automaticamente, mas podemos forçar uma atualização
      } catch (error) {
        console.error('Erro ao migrar favoritos do dashboard:', error);
      }
    }
    
    // Migrar favoritos de relatórios
    const reportCategories = ['gerencial', 'financeiro', 'operacional', 'faturamento', 'comercial'];
    reportCategories.forEach(category => {
      const categoryKey = `${category}Favorites`;
      const categoryFavorites = localStorage.getItem(categoryKey);
      if (categoryFavorites) {
        try {
          const parsed = JSON.parse(categoryFavorites);
          console.log(`Favoritos de ${category} encontrados:`, parsed);
          // Adicionar ao store global
          parsed.forEach((item: string) => {
            addFavorite('reports', item, category);
          });
        } catch (error) {
          console.error(`Erro ao migrar favoritos de ${category}:`, error);
        }
      }
    });
  }, [addFavorite]);
  
  // Função para sincronizar favoritos do store com localStorage
  const syncFavoritesToLocalStorage = useCallback(() => {
    console.log('Sincronizando favoritos do store para localStorage...');
    
    // Sincronizar favoritos do dashboard
    localStorage.setItem('dashboard_favorites', JSON.stringify(favorites.dashboard));
    
    // Sincronizar favoritos de relatórios
    Object.entries(favorites.reports).forEach(([category, items]) => {
      const categoryKey = `${category}Favorites`;
      localStorage.setItem(categoryKey, JSON.stringify(items));
    });
    
    console.log('Favoritos sincronizados com localStorage');
  }, [favorites.dashboard, favorites.reports]);
  
  // Função para adicionar favorito (compatível com sistema existente)
  const addFavoriteLegacy = useCallback((moduleId: string) => {
    console.log('Adicionando favorito (legacy):', moduleId);
    addFavorite('dashboard', moduleId);
    syncFavoritesToLocalStorage();
  }, [addFavorite, syncFavoritesToLocalStorage]);
  
  // Função para remover favorito (compatível com sistema existente)
  const removeFavoriteLegacy = useCallback((moduleId: string) => {
    console.log('Removendo favorito (legacy):', moduleId);
    removeFavorite('dashboard', moduleId);
    syncFavoritesToLocalStorage();
  }, [removeFavorite, syncFavoritesToLocalStorage]);
  
  // Função para verificar se é favorito (compatível com sistema existente)
  const isFavoriteLegacy = useCallback((moduleId: string) => {
    return isFavorite('dashboard', moduleId);
  }, [isFavorite]);
  
  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    migrateFavoritesFromLocalStorage,
    syncFavoritesToLocalStorage,
    addFavoriteLegacy,
    removeFavoriteLegacy,
    isFavoriteLegacy
  };
};

// Hook específico para integração com dados do usuário
export const useUserIntegration = () => {
  const { user, setUser, updateUser, clearUser } = useUser();
  
  // Função para migrar dados do usuário do localStorage
  const migrateUserFromLocalStorage = useCallback(() => {
    console.log('Migrando dados do usuário do localStorage...');
    
    const userJobTitle = localStorage.getItem('user_job_title');
    const userDepartment = localStorage.getItem('user_department');
    const userAvatar = localStorage.getItem('user_avatar');
    
    if (userJobTitle || userDepartment || userAvatar) {
      const userData: UserProfile = {
        id: '1',
        name: 'Usuário',
        email: 'usuario@exemplo.com',
        jobTitle: userJobTitle || undefined,
        department: userDepartment || undefined,
        avatar: userAvatar || undefined,
        lastLogin: new Date().toISOString()
      };
      
      setUser(userData);
      console.log('Dados do usuário migrados:', userData);
    }
  }, [setUser]);
  
  // Função para sincronizar dados do usuário com localStorage
  const syncUserToLocalStorage = useCallback((updates: UserProfileUpdate) => {
    console.log('Sincronizando dados do usuário com localStorage...');
    
    if (updates.jobTitle) {
      localStorage.setItem('user_job_title', updates.jobTitle);
    }
    if (updates.department) {
      localStorage.setItem('user_department', updates.department);
    }
    if (updates.avatar) {
      localStorage.setItem('user_avatar', updates.avatar);
    }
    
    console.log('Dados do usuário sincronizados com localStorage');
  }, []);
  
  // Função para atualizar usuário (compatível com sistema existente)
  const updateUserLegacy = useCallback((updates: UserProfileUpdate) => {
    console.log('Atualizando usuário (legacy):', updates);
    updateUser(updates);
    syncUserToLocalStorage(updates);
  }, [updateUser, syncUserToLocalStorage]);
  
  return {
    user,
    setUser,
    updateUser,
    clearUser,
    migrateUserFromLocalStorage,
    syncUserToLocalStorage,
    updateUserLegacy
  };
};

// Hook para gerenciar layout e preferências
export const useLayoutIntegration = () => {
  const { layout, theme, sidebarCollapsed, setLayout, setTheme, toggleSidebar } = useLayout();
  
  // Função para migrar layout do localStorage
  const migrateLayoutFromLocalStorage = () => {
    console.log('Migrando layout do localStorage...');
    
    const savedLayout = localStorage.getItem('dashboard_layout');
    if (savedLayout) {
      setLayout({
        type: savedLayout === 'personalizado' ? 'personalizado' : 'atual'
      });
      console.log('Layout migrado:', savedLayout);
    }
  };
  
  // Função para sincronizar layout com localStorage
  const syncLayoutToLocalStorage = (newLayout: typeof layout) => {
    console.log('Sincronizando layout com localStorage...');
    localStorage.setItem('dashboard_layout', newLayout.type);
    console.log('Layout sincronizado:', newLayout.type);
  };
  
  // Função para atualizar layout (compatível com sistema existente)
  const updateLayoutLegacy = (layoutType: 'atual' | 'personalizado') => {
    console.log('Atualizando layout (legacy):', layoutType);
    const newLayout = { type: layoutType };
    setLayout(newLayout);
    syncLayoutToLocalStorage(newLayout);
  };
  
  return {
    layout,
    theme,
    sidebarCollapsed,
    setLayout,
    setTheme,
    toggleSidebar,
    migrateLayoutFromLocalStorage,
    syncLayoutToLocalStorage,
    updateLayoutLegacy
  };
};
