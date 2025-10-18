import React, { useState, useEffect } from 'react';
import usePWA from '../../hooks/usePWA';
import useNotifications from '../../hooks/useNotifications';
import './InstallPrompt.css';

interface InstallPromptProps {
  className?: string;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ className = '' }) => {
  const { isInstallable, isInstalled, install, isUpdateAvailable, update } = usePWA();
  const { showSuccess, showError } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Mostrar prompt se for instalável e não estiver instalado
    if (isInstallable && !isInstalled) {
      setIsVisible(true);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      await install();
      showSuccess('PWA Instalado!', 'O aplicativo foi instalado com sucesso.');
      setIsVisible(false);
    } catch (error) {
      showError('Erro na Instalação', 'Não foi possível instalar o aplicativo.');
      console.error('Erro ao instalar:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await update();
      showSuccess('PWA Atualizado!', 'O aplicativo foi atualizado com sucesso.');
    } catch (error) {
      showError('Erro na Atualização', 'Não foi possível atualizar o aplicativo.');
      console.error('Erro ao atualizar:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Salvar no localStorage para não mostrar novamente por um tempo
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Verificar se foi dispensado recentemente
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      if (dismissedTime > oneDayAgo) {
        setIsVisible(false);
      }
    }
  }, []);

  if (!isVisible && !isUpdateAvailable) {
    return null;
  }

  return (
    <div className={`install-prompt ${className}`}>
      {isUpdateAvailable ? (
        <div className="install-prompt__update">
          <div className="install-prompt__icon">🔄</div>
          <div className="install-prompt__content">
            <h3>Atualização Disponível</h3>
            <p>Uma nova versão do aplicativo está disponível.</p>
          </div>
          <div className="install-prompt__actions">
            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="install-prompt__install">
          <div className="install-prompt__icon">📱</div>
          <div className="install-prompt__content">
            <h3>Instalar App</h3>
            <p>Instale o aplicativo para uma experiência melhor e acesso offline.</p>
          </div>
          <div className="install-prompt__actions">
            <button
              className="btn btn-primary"
              onClick={handleInstall}
              disabled={isInstalling}
            >
              {isInstalling ? 'Instalando...' : 'Instalar'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleDismiss}
            >
              Agora não
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallPrompt;
