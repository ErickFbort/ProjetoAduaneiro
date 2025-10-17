import React, { useEffect } from 'react';
import { useGlobalState, useFavoritesIntegration, useUserIntegration, useLayoutIntegration } from '../stores';

// Componente wrapper para gerenciar estado global
export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initializeFromLocalStorage } = useGlobalState();
  const { migrateFavoritesFromLocalStorage, syncFavoritesToLocalStorage } = useFavoritesIntegration();
  const { migrateUserFromLocalStorage } = useUserIntegration();
  const { migrateLayoutFromLocalStorage } = useLayoutIntegration();

  // Inicializar estado global na montagem
  useEffect(() => {
    console.log('Inicializando GlobalStateProvider...');
    
    // Inicializar store global
    initializeFromLocalStorage();
    
    // Migrar dados existentes do localStorage
    migrateUserFromLocalStorage();
    migrateFavoritesFromLocalStorage();
    migrateLayoutFromLocalStorage();
    
    // Sincronizar favoritos com localStorage
    syncFavoritesToLocalStorage();
    
    console.log('GlobalStateProvider inicializado com sucesso!');
  }, []); // Remover dependências para evitar re-renderizações infinitas

  return <>{children}</>;
};

// Hook para acessar funções de integração globalmente
export const useGlobalIntegration = () => {
  const favoritesIntegration = useFavoritesIntegration();
  const userIntegration = useUserIntegration();
  const layoutIntegration = useLayoutIntegration();

  return {
    ...favoritesIntegration,
    ...userIntegration,
    ...layoutIntegration
  };
};
