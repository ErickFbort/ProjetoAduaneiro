import React, { useEffect } from 'react';
import { useFavoritesIntegration } from '../stores';

// Componente para gerenciar favoritos e integrar com sistema existente
export const FavoritesManager: React.FC = () => {
  const {
    favorites,
    addFavoriteLegacy,
    removeFavoriteLegacy,
    isFavoriteLegacy,
    migrateFavoritesFromLocalStorage,
    syncFavoritesToLocalStorage
  } = useFavoritesIntegration();

  // Inicializar integração com sistema existente
  useEffect(() => {
    console.log('Inicializando FavoritesManager...');
    
    // Migrar favoritos do localStorage
    migrateFavoritesFromLocalStorage();
    
    // Expor funções globalmente para compatibilidade com sistema existente
    if (typeof window !== 'undefined') {
      // Funções para o sistema de favoritos do dashboard
      (window as any).addFavoriteGlobal = addFavoriteLegacy;
      (window as any).removeFavoriteGlobal = removeFavoriteLegacy;
      (window as any).isFavoriteGlobal = isFavoriteLegacy;
      (window as any).syncFavoritesGlobal = syncFavoritesToLocalStorage;
      
      // Funções para relatórios
      (window as any).toggleFavoriteReport = (reportType: string, category: string) => {
        const isFav = isFavoriteLegacy(reportType);
        if (isFav) {
          removeFavoriteLegacy(reportType);
        } else {
          addFavoriteLegacy(reportType);
        }
        syncFavoritesToLocalStorage();
      };
      
      // Função para carregar favoritos do dashboard
      (window as any).loadFavoritesGlobal = () => {
        console.log('Favoritos carregados do store global:', favorites.dashboard);
        return favorites.dashboard;
      };
      
      // Função para salvar favoritos do dashboard
      (window as any).saveFavoritesGlobal = (newFavorites: string[]) => {
        console.log('Salvando favoritos no store global:', newFavorites);
        // Limpar favoritos atuais
        favorites.dashboard.forEach(fav => removeFavoriteLegacy(fav));
        // Adicionar novos favoritos
        newFavorites.forEach(fav => addFavoriteLegacy(fav));
        syncFavoritesToLocalStorage();
      };
      
      // Função para renderizar favoritos (compatibilidade)
      (window as any).renderFavoritesGlobal = () => {
        console.log('Renderizando favoritos do store global...');
        // Esta função pode ser chamada pelo sistema existente
        // O React irá re-renderizar automaticamente quando o estado mudar
      };
    }
    
    console.log('FavoritesManager inicializado com sucesso!');
  }, []); // Remover dependências para evitar re-renderizações infinitas

  // Sincronizar com localStorage quando favoritos mudarem (sem dependências problemáticas)
  useEffect(() => {
    syncFavoritesToLocalStorage();
  }, [favorites.dashboard]); // Apenas favoritos do dashboard

  // Este componente não renderiza nada visível, apenas gerencia estado
  return null;
};

// Hook para acessar funções de favoritos
export const useFavoritesManager = () => {
  const favoritesIntegration = useFavoritesIntegration();
  
  return {
    ...favoritesIntegration,
    // Funções específicas para o manager
    loadFavorites: () => favoritesIntegration.favorites.dashboard,
    saveFavorites: (newFavorites: string[]) => {
      // Limpar favoritos atuais
      favoritesIntegration.favorites.dashboard.forEach(fav => 
        favoritesIntegration.removeFavorite('dashboard', fav)
      );
      // Adicionar novos favoritos
      newFavorites.forEach(fav => 
        favoritesIntegration.addFavorite('dashboard', fav)
      );
      favoritesIntegration.syncFavoritesToLocalStorage();
    }
  };
};
