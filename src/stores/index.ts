// Exportar store principal e hooks
export { useGlobalStore, useUser, useFavorites, useLayout, useNotifications, useLoading } from './globalStore';

// Exportar hooks de integração
export { useGlobalState, useFavoritesIntegration, useUserIntegration, useLayoutIntegration } from '../hooks/useGlobalState';

// Exportar tipos
export type { FavoriteItem, DashboardLayout } from './globalStore';
