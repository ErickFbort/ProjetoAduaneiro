// Utilitário para testar o sistema de estado global
import { useGlobalStore } from '../stores/globalStore';

// Função para testar o store global
export const testGlobalState = () => {
  console.log('🧪 Testando sistema de estado global...');
  
  const store = useGlobalStore.getState();
  
  // Teste 1: Estado inicial
  console.log('📊 Estado inicial:', store);
  
  // Teste 2: Adicionar favorito
  console.log('⭐ Testando adição de favorito...');
  store.addFavorite('dashboard', 'teste-modulo');
  console.log('Favoritos após adicionar:', store.favorites.dashboard);
  
  // Teste 3: Verificar se é favorito
  const isFav = store.isFavorite('dashboard', 'teste-modulo');
  console.log('É favorito?', isFav);
  
  // Teste 4: Remover favorito
  console.log('🗑️ Testando remoção de favorito...');
  store.removeFavorite('dashboard', 'teste-modulo');
  console.log('Favoritos após remover:', store.favorites.dashboard);
  
  // Teste 5: Dados do usuário
  console.log('👤 Testando dados do usuário...');
  const testUser = {
    id: 'test-1',
    name: 'Usuário Teste',
    email: 'teste@exemplo.com',
    jobTitle: 'Desenvolvedor Teste',
    department: 'TI',
    lastLogin: new Date().toISOString()
  };
  
  store.setUser(testUser);
  console.log('Usuário definido:', store.user);
  
  // Teste 6: Atualizar usuário
  store.updateUser({ jobTitle: 'Senior Developer' });
  console.log('Usuário atualizado:', store.user);
  
  // Teste 7: Layout
  console.log('🎨 Testando layout...');
  store.setLayout({ type: 'personalizado' });
  console.log('Layout atual:', store.layout);
  
  // Teste 8: Tema
  store.setTheme('dark');
  console.log('Tema atual:', store.theme);
  
  // Teste 9: Notificações
  store.updateNotifications({ enabled: true, sound: true });
  console.log('Notificações atual:', store.notifications);
  
  // Teste 10: Reset
  console.log('🔄 Testando reset...');
  store.resetToDefaults();
  console.log('Estado após reset:', store);
  
  console.log('✅ Testes do sistema de estado global concluídos!');
};

// Função para testar integração com localStorage
export const testLocalStorageIntegration = () => {
  console.log('💾 Testando integração com localStorage...');
  
  // Limpar localStorage para teste
  localStorage.removeItem('global-store');
  localStorage.removeItem('dashboard_favorites');
  localStorage.removeItem('user_job_title');
  localStorage.removeItem('user_department');
  localStorage.removeItem('user_avatar');
  
  console.log('🧹 localStorage limpo');
  
  // Simular dados existentes
  localStorage.setItem('dashboard_favorites', JSON.stringify(['cadastro', 'relatorios']));
  localStorage.setItem('user_job_title', 'Desenvolvedor');
  localStorage.setItem('user_department', 'TI');
  
  console.log('📝 Dados simulados adicionados ao localStorage');
  
  // Inicializar store
  const store = useGlobalStore.getState();
  store.initializeFromLocalStorage();
  
  console.log('🔄 Store inicializado do localStorage');
  console.log('Favoritos carregados:', store.favorites.dashboard);
  console.log('Usuário carregado:', store.user);
  
  // Testar sincronização
  store.addFavorite('dashboard', 'web_cliente');
  console.log('Favorito adicionado, verificando localStorage...');
  
  const savedFavorites = localStorage.getItem('dashboard_favorites');
  console.log('Favoritos no localStorage:', JSON.parse(savedFavorites || '[]'));
  
  console.log('✅ Teste de integração com localStorage concluído!');
};

// Função para testar funções globais
export const testGlobalFunctions = () => {
  console.log('🌐 Testando funções globais...');
  
  // Verificar se as funções estão disponíveis
  const globalFunctions = [
    'addFavoriteGlobal',
    'removeFavoriteGlobal', 
    'isFavoriteGlobal',
    'loadFavoritesGlobal',
    'saveFavoritesGlobal',
    'toggleFavoriteReport',
    'updateGlobalUserProfile',
    'uploadGlobalAvatar'
  ];
  
  globalFunctions.forEach(funcName => {
    const exists = typeof (window as any)[funcName] === 'function';
    console.log(`${exists ? '✅' : '❌'} ${funcName}: ${exists ? 'Disponível' : 'Não encontrada'}`);
  });
  
  // Testar algumas funções se disponíveis
  if (typeof (window as any).addFavoriteGlobal === 'function') {
    console.log('🧪 Testando addFavoriteGlobal...');
    (window as any).addFavoriteGlobal('teste-global');
    
    if (typeof (window as any).isFavoriteGlobal === 'function') {
      const isFav = (window as any).isFavoriteGlobal('teste-global');
      console.log('Favorito adicionado via função global?', isFav);
    }
  }
  
  console.log('✅ Teste de funções globais concluído!');
};

// Função principal de teste
export const runAllTests = () => {
  console.log('🚀 Iniciando todos os testes do sistema de estado global...');
  console.log('='.repeat(60));
  
  try {
    testGlobalState();
    console.log('='.repeat(60));
    testLocalStorageIntegration();
    console.log('='.repeat(60));
    testGlobalFunctions();
    console.log('='.repeat(60));
    
    console.log('🎉 Todos os testes concluídos com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  (window as any).testGlobalState = testGlobalState;
  (window as any).testLocalStorageIntegration = testLocalStorageIntegration;
  (window as any).testGlobalFunctions = testGlobalFunctions;
  (window as any).runAllGlobalStateTests = runAllTests;
}
