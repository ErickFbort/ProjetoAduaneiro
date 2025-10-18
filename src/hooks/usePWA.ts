import { useState, useEffect, useCallback } from 'react';

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: any;
  registration: ServiceWorkerRegistration | null;
}

interface UsePWAReturn extends PWAState {
  install: () => Promise<void>;
  update: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
}

export const usePWA = (): UsePWAReturn => {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null,
    registration: null
  });

  // Verificar se está instalado
  useEffect(() => {
    const checkInstalled = () => {
      const isInstalled = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      setState(prev => ({ ...prev, isInstalled }));
    };

    checkInstalled();
    window.addEventListener('resize', checkInstalled);
    
    return () => window.removeEventListener('resize', checkInstalled);
  }, []);

  // Verificar conectividade
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Registrar Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          setState(prev => ({ ...prev, registration }));

          // Verificar atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ ...prev, isUpdateAvailable: true }));
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Erro ao registrar Service Worker:', error);
        });
    }
  }, []);

  // Interceptar prompt de instalação
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({ 
        ...prev, 
        installPrompt: e,
        isInstallable: true 
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Instalar PWA
  const install = useCallback(async () => {
    if (!state.installPrompt) {
      throw new Error('Prompt de instalação não disponível');
    }

    try {
      await state.installPrompt.prompt();
      const { outcome } = await state.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstalled: true,
          isInstallable: false,
          installPrompt: null 
        }));
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      throw error;
    }
  }, [state.installPrompt]);

  // Atualizar PWA
  const update = useCallback(async () => {
    if (!state.registration) {
      throw new Error('Service Worker não registrado');
    }

    try {
      await state.registration.update();
      setState(prev => ({ ...prev, isUpdateAvailable: false }));
    } catch (error) {
      console.error('Erro ao atualizar PWA:', error);
      throw error;
    }
  }, [state.registration]);

  // Verificar atualizações
  const checkForUpdates = useCallback(async () => {
    if (!state.registration) {
      return;
    }

    try {
      await state.registration.update();
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  }, [state.registration]);

  return {
    ...state,
    install,
    update,
    checkForUpdates
  };
};

export default usePWA;
