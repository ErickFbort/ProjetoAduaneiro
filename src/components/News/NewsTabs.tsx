import React, { useState, useEffect, useCallback } from 'react';
import { NewsTabsProps, NewsItem } from '../../types/news';
import { NEWS_TABS, UPDATE_ICONS, UPDATE_BADGE_CLASSES } from '../../constants/news';
import './NewsTabs.css';

export const NewsTabs: React.FC<NewsTabsProps> = ({
  data,
  onRefresh,
  onForceRefreshLinkedIn,
  autoRotateInterval = 8000,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'paclog' | 'linkedin' | 'sistema'>('linkedin');
  const [isHovering, setIsHovering] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  // Função para formatar data
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  // Função para obter ícone de atualização
  const getUpdateIcon = useCallback((type?: string) => {
    if (!type) return 'info-circle';
    return UPDATE_ICONS[type as keyof typeof UPDATE_ICONS] || 'info-circle';
  }, []);

  // Função para obter classe do badge
  const getUpdateBadgeClass = useCallback((type?: string) => {
    if (!type) return 'primary';
    return UPDATE_BADGE_CLASSES[type as keyof typeof UPDATE_BADGE_CLASSES] || 'primary';
  }, []);

  // Função para alternar aba
  const switchTab = useCallback((tabId: 'paclog' | 'linkedin' | 'sistema') => {
    setActiveTab(tabId);
    setIsRotating(false);
    
    // Reiniciar rotação após um delay
    setTimeout(() => {
      setIsRotating(true);
    }, 2000);
  }, []);

  // Função para pausar rotação
  const pauseRotation = useCallback(() => {
    setIsHovering(true);
  }, []);

  // Função para retomar rotação
  const resumeRotation = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Sistema de rotação automática
  useEffect(() => {
    if (!isRotating || isHovering) return;

    const tabs = ['paclog', 'linkedin', 'sistema'] as const;
    let currentIndex = tabs.indexOf(activeTab);

    const interval = setInterval(() => {
      if (!isHovering) {
        currentIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[currentIndex]);
      }
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [activeTab, isRotating, isHovering, autoRotateInterval]);

  // Renderizar item de notícia
  const renderNewsItem = useCallback((item: NewsItem) => {
    if (activeTab === 'sistema') {
      return (
        <div 
          key={item.id} 
          className="system-update-item"
          onMouseEnter={pauseRotation}
          onMouseLeave={resumeRotation}
        >
          <div className="update-header">
            <div className="update-icon">
              <i className={`fas fa-${getUpdateIcon(item.type)}`}></i>
            </div>
            <div className="update-info">
              <h4 className="update-title">{item.title}</h4>
              <div className="update-meta">
                <span className="update-version">v{item.version}</span>
                <span className="update-date">{formatDate(item.date)}</span>
              </div>
            </div>
            <div className="update-badge">
              <span className={`badge badge-${getUpdateBadgeClass(item.type)}`}>
                {item.category}
              </span>
            </div>
          </div>
          <div className="update-content">
            <p>{item.content}</p>
          </div>
          <div className="update-footer">
            <span className="update-source">{item.source}</span>
          </div>
        </div>
      );
    }

    return (
      <div 
        key={item.id} 
        className="news-item"
        onMouseEnter={pauseRotation}
        onMouseLeave={resumeRotation}
      >
        <div className="news-header">
          <h4>{item.title}</h4>
          <span className="news-date">{formatDate(item.date)}</span>
        </div>
        <div className="news-meta">
          <span className="news-category">{item.category}</span>
          <span className="news-source">{item.source}</span>
        </div>
        <div className="news-content">
          <p>{item.content}</p>
        </div>
      </div>
    );
  }, [activeTab, formatDate, getUpdateIcon, getUpdateBadgeClass, pauseRotation, resumeRotation]);

  // Renderizar conteúdo vazio
  const renderEmptyState = useCallback(() => {
    const messages = {
      paclog: 'Nenhuma notícia do Pac Log disponível no momento.',
      linkedin: 'Nenhuma postagem do LinkedIn disponível no momento.',
      sistema: 'Nenhuma atualização do sistema disponível no momento.'
    };

    return (
      <div className="empty-news-state">
        <i className="fas fa-newspaper"></i>
        <p>{messages[activeTab]}</p>
      </div>
    );
  }, [activeTab]);

  const currentData = data[activeTab] || [];

  return (
    <div className={`news-section ${className}`}>
      <div className="section-header">
        <h2>
          <i className="fas fa-newspaper"></i> 
          Novidades e Comunicados
        </h2>
        <div className="section-actions">
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={onRefresh}
            title="Atualizar notícias"
          >
            <i className="fas fa-sync-alt"></i> Atualizar
          </button>
          <button 
            className="btn btn-outline-warning btn-sm" 
            onClick={onForceRefreshLinkedIn}
            title="Forçar atualização do LinkedIn (limpar cache)"
          >
            <i className="fas fa-refresh"></i> Forçar LinkedIn
          </button>
        </div>
      </div>
      
      <div className="news-content">
        <div className="news-tabs">
          {NEWS_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => switchTab(tab.id)}
              style={{ '--tab-color': tab.color } as React.CSSProperties}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="news-list">
          {currentData.length > 0 ? (
            currentData.map(renderNewsItem)
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsTabs;
