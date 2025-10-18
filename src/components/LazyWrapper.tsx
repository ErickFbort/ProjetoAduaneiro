import React, { Suspense, lazy, ComponentType } from 'react';
import { useLazyComponent, useLazyComponentWithIntersection } from '../hooks/useLazyComponent';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  useIntersection?: boolean;
  rootMargin?: string;
  threshold?: number;
  delay?: number;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Wrapper para carregamento lazy de componentes
 * Otimiza a performance carregando componentes apenas quando necessário
 */
export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <div className="lazy-loading">Carregando...</div>,
  useIntersection = false,
  rootMargin = '50px',
  threshold = 0.1,
  delay = 0,
  retryCount = 3,
  retryDelay = 1000
}) => {
  const defaultFallback = (
    <div className="lazy-loading-container">
      <div className="lazy-loading-spinner">
        <div className="spinner"></div>
        <span>Carregando componente...</span>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <div data-lazy-component>
        {children}
      </div>
    </Suspense>
  );
};

/**
 * HOC para criar componentes lazy
 */
export function withLazyLoading<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    fallback?: React.ReactNode;
    useIntersection?: boolean;
    rootMargin?: string;
    threshold?: number;
    delay?: number;
    retryCount?: number;
    retryDelay?: number;
  } = {}
) {
  return function LazyComponent(props: T) {
    const {
      fallback,
      useIntersection = false,
      rootMargin = '50px',
      threshold = 0.1,
      delay = 0,
      retryCount = 3,
      retryDelay = 1000
    } = options;

    const lazyHook = useIntersection 
      ? useLazyComponentWithIntersection(importFn, { rootMargin, threshold, delay, retryCount, retryDelay })
      : useLazyComponent(importFn, { delay, retryCount, retryDelay });

    if (lazyHook.loading) {
      return fallback || <div className="lazy-loading">Carregando...</div>;
    }

    if (lazyHook.error) {
      return (
        <div className="lazy-error">
          <p>Erro ao carregar componente: {lazyHook.error.message}</p>
          <button onClick={lazyHook.retry}>Tentar novamente</button>
        </div>
      );
    }

    if (lazyHook.Component) {
      return <lazyHook.Component {...props} />;
    }

    return null;
  };
}

/**
 * Componente para carregamento lazy com Intersection Observer
 */
export const LazyIntersection: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  delay?: number;
}> = ({ children, fallback, rootMargin, threshold, delay }) => {
  return (
    <LazyWrapper
      useIntersection={true}
      rootMargin={rootMargin}
      threshold={threshold}
      delay={delay}
      fallback={fallback}
    >
      {children}
    </LazyWrapper>
  );
};

// CSS para o loading spinner
export const lazyLoadingStyles = `
.lazy-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 100px;
}

.lazy-loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.lazy-error {
  padding: 1rem;
  text-align: center;
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
}

.lazy-error button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.lazy-error button:hover {
  background-color: #0056b3;
}
`;
