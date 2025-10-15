import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  console.log('NewsTabs renderizado com activeTab:', activeTab);
  console.log('Dados disponíveis:', data);
  console.log('NEWS_TABS:', NEWS_TABS);
  console.log('Props recebidas:', { onRefresh, onForceRefreshLinkedIn, autoRotateInterval, className });

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
    console.log('Alternando para aba:', tabId);
    console.log('Dados disponíveis para nova aba:', data?.[tabId]);
    setActiveTab(tabId);
    setIsRotating(false);
    
    // Reiniciar rotação após um delay
    setTimeout(() => {
      setIsRotating(true);
    }, 2000);
  }, [data]);

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
        <motion.div 
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
        </motion.div>
      );
    }

    return (
      <motion.div 
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
      </motion.div>
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
      <motion.div 
        className="empty-news-state"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.25,
          type: "tween",
          ease: "easeOut"
        }}
      >
        <motion.i 
          className="fas fa-newspaper"
          animate={{ 
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 4,
            type: "tween",
            ease: "easeInOut"
          }}
        ></motion.i>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.15, 
            duration: 0.25,
            type: "tween",
            ease: "easeOut"
          }}
        >
          {messages[activeTab]}
        </motion.p>
      </motion.div>
    );
  }, [activeTab]);

  const currentData = data?.[activeTab] || [];
  console.log('Dados atuais para aba', activeTab, ':', currentData);
  console.log('Tipo de dados:', typeof data);
  console.log('Chaves de dados:', data ? Object.keys(data) : 'data é undefined');

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
        <motion.div 
          className="news-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.4, 0, 0.2, 1],
            type: "tween"
          }}
        >
          {NEWS_TABS.map((tab) => {
            console.log('Renderizando aba:', tab);
            return (
              <motion.button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => switchTab(tab.id)}
                style={{ '--tab-color': tab.color } as React.CSSProperties}
                /* Removidas animações de hover dos botões das abas */
                /* Removidas animações de escala e movimento dos botões */
                transition={{
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1],
                  type: "tween"
                }}
              >
                <i className={tab.icon}></i>
                <span>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
        
        <motion.div 
          className="news-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.25,
            type: "tween",
            ease: "easeOut"
          }}
        >
          <AnimatePresence mode="wait">
            {currentData && currentData.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.4, 0, 0.2, 1],
                  type: "tween"
                }}
                className="news-content-slide"
              >
                {currentData.map((item, index) => (
                  <motion.div
                    key={`${activeTab}-${item.id}`}
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      type: "tween",
                      ease: "easeOut"
                    }}
                  >
                    {renderNewsItem(item)}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ 
                  duration: 0.3,
                  type: "tween",
                  ease: "easeOut"
                }}
              >
                {renderEmptyState()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsTabs;
