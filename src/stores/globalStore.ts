import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, UserProfileUpdate } from '../types/user';

// Tipos para o estado global
export interface FavoriteItem {
  id: string;
  type: 'module' | 'report' | 'action';
  title: string;
  description?: string;
  icon?: string;
  url?: string;
  category?: string;
  module?: string;
}

export interface DashboardLayout {
  type: 'atual' | 'personalizado';
  customLayout?: {
    modules: string[];
    order: string[];
  };
}

export interface GlobalState {
  // Dados do usuário
  user: UserProfile | null;
  
  // Favoritos
  favorites: {
    dashboard: string[]; // IDs dos módulos favoritos do dashboard
    reports: { [key: string]: string[] }; // Favoritos por categoria de relatório
    actions: string[]; // Ações favoritas
  };
  
  // Layout e preferências
  layout: DashboardLayout;
  theme: 'light' | 'dark' | 'auto';
  sidebarCollapsed: boolean;
  
  // Configurações de notificações
  notifications: {
    enabled: boolean;
    email: boolean;
    browser: boolean;
    sound: boolean;
  };
  
  // Estado de carregamento
  loading: {
    user: boolean;
    favorites: boolean;
    layout: boolean;
  };
  
  // Ações para dados do usuário
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: UserProfileUpdate) => void;
  clearUser: () => void;
  
  // Ações para favoritos
  addFavorite: (type: 'dashboard' | 'reports' | 'actions', item: string, category?: string) => void;
  removeFavorite: (type: 'dashboard' | 'reports' | 'actions', item: string, category?: string) => void;
  toggleFavorite: (type: 'dashboard' | 'reports' | 'actions', item: string, category?: string) => void;
  isFavorite: (type: 'dashboard' | 'reports' | 'actions', item: string, category?: string) => boolean;
  clearFavorites: (type?: 'dashboard' | 'reports' | 'actions') => void;
  
  // Ações para layout
  setLayout: (layout: DashboardLayout) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleSidebar: () => void;
  
  // Ações para notificações
  updateNotifications: (settings: Partial<GlobalState['notifications']>) => void;
  
  // Ações de carregamento
  setLoading: (key: keyof GlobalState['loading'], value: boolean) => void;
  
  // Ações de inicialização
  initializeFromLocalStorage: () => void;
  resetToDefaults: () => void;
}

// Estado padrão
const defaultState = {
  user: null,
  favorites: {
    dashboard: ['cadastro', 'relatorios', 'web_cliente', 'faturamento'],
    reports: {},
    actions: []
  },
  layout: {
    type: 'atual' as const
  },
  theme: 'light' as const,
  sidebarCollapsed: false,
  notifications: {
    enabled: true,
    email: true,
    browser: true,
    sound: false
  },
  loading: {
    user: false,
    favorites: false,
    layout: false
  }
};

// Store global usando Zustand com persistência
export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      // Ações para dados do usuário
      setUser: (user) => {
        set({ user });
        console.log('Usuário definido no store global:', user);
      },
      
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          console.log('Usuário atualizado no store global:', updatedUser);
        }
      },
      
      clearUser: () => {
        set({ user: null });
        console.log('Usuário removido do store global');
      },
      
      // Ações para favoritos
      addFavorite: (type, item, category) => {
        const state = get();
        const favorites = { ...state.favorites };
        
        if (type === 'reports' && category) {
          if (!favorites.reports[category]) {
            favorites.reports[category] = [];
          }
          if (!favorites.reports[category].includes(item)) {
            favorites.reports[category].push(item);
          }
        } else {
          const key = type as keyof typeof favorites;
          if (key !== 'reports' && !favorites[key].includes(item)) {
            favorites[key] = [...favorites[key], item];
          }
        }
        
        set({ favorites });
        console.log(`Favorito adicionado: ${type}/${item}`, category ? `(categoria: ${category})` : '');
      },
      
      removeFavorite: (type, item, category) => {
        const state = get();
        const favorites = { ...state.favorites };
        
        if (type === 'reports' && category) {
          if (favorites.reports[category]) {
            favorites.reports[category] = favorites.reports[category].filter(id => id !== item);
          }
        } else {
          const key = type as keyof typeof favorites;
          if (key !== 'reports') {
            favorites[key] = favorites[key].filter(id => id !== item);
          }
        }
        
        set({ favorites });
        console.log(`Favorito removido: ${type}/${item}`, category ? `(categoria: ${category})` : '');
      },
      
      toggleFavorite: (type, item, category) => {
        const state = get();
        if (state.isFavorite(type, item, category)) {
          state.removeFavorite(type, item, category);
        } else {
          state.addFavorite(type, item, category);
        }
      },
      
      isFavorite: (type, item, category) => {
        const state = get();
        
        if (type === 'reports' && category) {
          return state.favorites.reports[category]?.includes(item) || false;
        } else {
          const key = type as keyof typeof state.favorites;
          return key !== 'reports' ? state.favorites[key].includes(item) : false;
        }
      },
      
      clearFavorites: (type) => {
        const state = get();
        const favorites = { ...state.favorites };
        
        if (type) {
          if (type === 'reports') {
            favorites.reports = {};
          } else {
            const key = type as keyof typeof favorites;
            if (key !== 'reports') {
              favorites[key] = [];
            }
          }
        } else {
          favorites.dashboard = [];
          favorites.reports = {};
          favorites.actions = [];
        }
        
        set({ favorites });
        console.log('Favoritos limpos:', type || 'todos');
      },
      
      // Ações para layout
      setLayout: (layout) => {
        set({ layout });
        console.log('Layout atualizado:', layout);
      },
      
      setTheme: (theme) => {
        set({ theme });
        console.log('Tema atualizado:', theme);
      },
      
      toggleSidebar: () => {
        const state = get();
        set({ sidebarCollapsed: !state.sidebarCollapsed });
        console.log('Sidebar toggled:', !state.sidebarCollapsed);
      },
      
      // Ações para notificações
      updateNotifications: (settings) => {
        const state = get();
        set({ 
          notifications: { ...state.notifications, ...settings }
        });
        console.log('Notificações atualizadas:', settings);
      },
      
      // Ações de carregamento
      setLoading: (key, value) => {
        const state = get();
        set({ 
          loading: { ...state.loading, [key]: value }
        });
      },
      
      // Ações de inicialização
      initializeFromLocalStorage: () => {
        console.log('Inicializando store global a partir do localStorage...');
        
        // Carregar dados do usuário do localStorage
        const userJobTitle = localStorage.getItem('user_job_title');
        const userDepartment = localStorage.getItem('user_department');
        const userAvatar = localStorage.getItem('user_avatar');
        
        if (userJobTitle || userDepartment || userAvatar) {
          const user: UserProfile = {
            id: '1',
            name: 'Usuário',
            email: 'usuario@exemplo.com',
            jobTitle: userJobTitle || undefined,
            department: userDepartment || undefined,
            avatar: userAvatar || undefined,
            lastLogin: new Date().toISOString()
          };
          
          set({ user });
        }
        
        // Carregar favoritos do dashboard
        const dashboardFavorites = localStorage.getItem('dashboard_favorites');
        if (dashboardFavorites) {
          try {
            const favorites = JSON.parse(dashboardFavorites);
            set(state => ({
              favorites: { ...state.favorites, dashboard: favorites }
            }));
          } catch (error) {
            console.error('Erro ao carregar favoritos do dashboard:', error);
          }
        }
        
        // Carregar layout
        const savedLayout = localStorage.getItem('dashboard_layout');
        if (savedLayout) {
          set({ 
            layout: { 
              type: savedLayout === 'personalizado' ? 'personalizado' : 'atual' 
            } 
          });
        }
        
        console.log('Store global inicializado com sucesso!');
      },
      
      resetToDefaults: () => {
        set(defaultState);
        console.log('Store global resetado para padrões');
      }
    }),
    {
      name: 'global-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        favorites: state.favorites,
        layout: state.layout,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        notifications: state.notifications
      })
    }
  )
);

// Hooks personalizados para facilitar o uso
export const useUser = () => {
  const user = useGlobalStore(state => state.user);
  const setUser = useGlobalStore(state => state.setUser);
  const updateUser = useGlobalStore(state => state.updateUser);
  const clearUser = useGlobalStore(state => state.clearUser);
  
  return { user, setUser, updateUser, clearUser };
};

export const useFavorites = () => {
  const favorites = useGlobalStore(state => state.favorites);
  const addFavorite = useGlobalStore(state => state.addFavorite);
  const removeFavorite = useGlobalStore(state => state.removeFavorite);
  const toggleFavorite = useGlobalStore(state => state.toggleFavorite);
  const isFavorite = useGlobalStore(state => state.isFavorite);
  const clearFavorites = useGlobalStore(state => state.clearFavorites);
  
  return { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    toggleFavorite, 
    isFavorite, 
    clearFavorites 
  };
};

export const useLayout = () => {
  const layout = useGlobalStore(state => state.layout);
  const theme = useGlobalStore(state => state.theme);
  const sidebarCollapsed = useGlobalStore(state => state.sidebarCollapsed);
  const setLayout = useGlobalStore(state => state.setLayout);
  const setTheme = useGlobalStore(state => state.setTheme);
  const toggleSidebar = useGlobalStore(state => state.toggleSidebar);
  
  return { 
    layout, 
    theme, 
    sidebarCollapsed, 
    setLayout, 
    setTheme, 
    toggleSidebar 
  };
};

export const useNotifications = () => {
  const notifications = useGlobalStore(state => state.notifications);
  const updateNotifications = useGlobalStore(state => state.updateNotifications);
  
  return { notifications, updateNotifications };
};

export const useLoading = () => {
  const loading = useGlobalStore(state => state.loading);
  const setLoading = useGlobalStore(state => state.setLoading);
  
  return { loading, setLoading };
};
