import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Terminal, CardSwapOptions } from '../types/terminal';
import './CardSwap.css';

interface CardSwapProps {
  terminals: Terminal[];
  onCardClick?: (terminal: Terminal) => void;
  options?: Partial<CardSwapOptions>;
  className?: string;
}

const defaultOptions: CardSwapOptions = {
  cardDistance: 80,
  verticalDistance: 90,
  delay: 4000,
  pauseOnHover: true,
  skewAmount: 8,
  easing: 'elastic',
  width: 450,
  height: 320
};

export const CardSwap: React.FC<CardSwapProps> = ({
  terminals,
  onCardClick,
  options = {},
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const orderRef = useRef<number[]>([]);
  const isPausedRef = useRef(false);

  const finalOptions = { ...defaultOptions, ...options };

  // Função para criar slot de posicionamento
  const makeSlot = useCallback((i: number, distX: number, distY: number, total: number) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i
  }), []);

  // Função para posicionar card
  const placeCard = useCallback((el: HTMLElement, slot: ReturnType<typeof makeSlot>, skew: number) => {
    gsap.set(el, {
      x: slot.x,
      y: slot.y,
      z: slot.z,
      skewY: skew,
      zIndex: slot.zIndex
    });
  }, []);

  // Função para obter configuração de animação
  const getAnimationConfig = useCallback(() => {
    if (finalOptions.easing === 'elastic') {
      return {
        ease: 'elastic.out(0.6,0.9)',
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        promoteOverlap: 0.9,
        returnDelay: 0.05
      };
    } else {
      return {
        ease: 'power1.inOut',
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        promoteOverlap: 0.45,
        returnDelay: 0.2
      };
    }
  }, [finalOptions.easing]);

  // Função para posicionar cards inicialmente
  const positionCards = useCallback(() => {
    if (!cardsRef.current.length) return;

    cardsRef.current.forEach((card, index) => {
      const slot = makeSlot(index, finalOptions.cardDistance, finalOptions.verticalDistance, cardsRef.current.length);
      placeCard(card, slot, finalOptions.skewAmount);
    });
  }, [finalOptions.cardDistance, finalOptions.verticalDistance, finalOptions.skewAmount, makeSlot, placeCard]);

  // Função para trocar cards
  const swapCards = useCallback(() => {
    if (orderRef.current.length < 2) return;

    const [front, ...rest] = orderRef.current;
    const frontCard = cardsRef.current[front];
    
    if (!frontCard) return;

    const config = getAnimationConfig();
    const timeline = gsap.timeline();
    timelineRef.current = timeline;

    // Animar card da frente para baixo
    timeline.to(frontCard, {
      y: '+=500',
      duration: config.durDrop,
      ease: config.ease
    });
    
    // Promover outros cards
    timeline.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
    
    rest.forEach((cardIndex, i) => {
      const card = cardsRef.current[cardIndex];
      if (!card) return;

      const slot = makeSlot(i, finalOptions.cardDistance, finalOptions.verticalDistance, cardsRef.current.length);
      
      timeline.set(card, { zIndex: slot.zIndex }, 'promote');
      timeline.to(card, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        duration: config.durMove,
        ease: config.ease
      }, `promote+=${i * 0.15}`);
    });
    
    // Retornar card da frente para o final
    const backSlot = makeSlot(cardsRef.current.length - 1, finalOptions.cardDistance, finalOptions.verticalDistance, cardsRef.current.length);
    timeline.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
    
    timeline.call(() => {
      gsap.set(frontCard, { zIndex: backSlot.zIndex });
    }, undefined, 'return');
    
    timeline.to(frontCard, {
      x: backSlot.x,
      y: backSlot.y,
      z: backSlot.z,
      duration: config.durReturn,
      ease: config.ease
    }, 'return');
    
    // Atualizar ordem
    timeline.call(() => {
      orderRef.current = [...rest, front];
    });
    
    // Reiniciar animação se não estiver pausada
    timeline.call(() => {
      if (!isPausedRef.current) {
        startAnimation();
      }
    });
  }, [finalOptions.cardDistance, finalOptions.verticalDistance, getAnimationConfig, makeSlot]);

  // Função para iniciar animação
  const startAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(swapCards, finalOptions.delay);
  }, [swapCards, finalOptions.delay]);

  // Função para pausar animação
  const pauseAnimation = useCallback(() => {
    isPausedRef.current = true;
    if (timelineRef.current) {
      timelineRef.current.pause();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Função para retomar animação
  const resumeAnimation = useCallback(() => {
    isPausedRef.current = false;
    if (timelineRef.current) {
      timelineRef.current.play();
    }
    startAnimation();
  }, [startAnimation]);

  // Função para lidar com clique no card
  const handleCardClick = useCallback((terminal: Terminal, index: number) => {
    // Só permite clique no card da frente (primeiro na ordem)
    if (index === orderRef.current[0] && onCardClick) {
      onCardClick(terminal);
    }
  }, [onCardClick]);

  // Inicializar quando os cards mudarem
  useEffect(() => {
    if (!terminals.length || !containerRef.current) return;

    // Inicializar ordem
    orderRef.current = Array.from({ length: terminals.length }, (_, i) => i);

    // Configurar cards
    cardsRef.current.forEach((card, index) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: 'center center',
        force3D: true,
        width: finalOptions.width,
        height: finalOptions.height
      });
    });

    // Posicionar cards
    positionCards();

    // Iniciar animação
    startAnimation();

    // Configurar eventos de hover se habilitado
    if (finalOptions.pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      
      const handleMouseEnter = () => pauseAnimation();
      const handleMouseLeave = () => resumeAnimation();
      
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [terminals, finalOptions.pauseOnHover, positionCards, startAnimation, pauseAnimation, resumeAnimation]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`card-swap-container ${className}`}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        transform: 'translate(-10%, 10%)',
        transformOrigin: 'bottom right',
        width: '90%',
        height: '600px',
        perspective: '1000px',
        overflow: 'visible'
      }}
    >
      {terminals.map((terminal, index) => (
        <div
          key={terminal.id}
          ref={(el) => {
            if (el) cardsRef.current[index] = el;
          }}
          className={`card-swap-card ${index === 0 ? 'front-card' : ''}`}
          onClick={() => handleCardClick(terminal, index)}
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            width: `${finalOptions.width}px`,
            height: `${finalOptions.height}px`,
            borderRadius: '25px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 16px 50px rgba(0, 0, 0, 0.15)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            cursor: index === 0 ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)'
          }}
        >
          <div className="terminal-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '2rem 2rem 0 2rem'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.8rem',
              color: '#1e293b',
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              {terminal.name}
            </h3>
            <span 
              className={`terminal-status ${terminal.status.toLowerCase()}`}
              style={{
                fontSize: '1.1rem',
                padding: '0.8rem 1.5rem',
                borderRadius: '30px',
                fontWeight: 600,
                background: 'rgba(76, 175, 80, 0.2)',
                color: '#4caf50',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}
            >
              {terminal.status}
            </span>
          </div>
          <div className="terminal-info" style={{
            padding: '0 2rem',
            fontSize: '1.2rem',
            lineHeight: 1.7
          }}>
            <p style={{ margin: '1rem 0', color: '#475569' }}>
              <strong>Telefone:</strong> {terminal.phone}
            </p>
            <p style={{ margin: '1rem 0', color: '#475569' }}>
              <strong>Operações:</strong> {terminal.operations}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSwap;
