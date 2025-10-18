import { useState, useEffect, useCallback } from 'react';

interface LazyComponentOptions {
  fallback?: React.ReactNode;
  delay?: number;
  retryCount?: number;
  retryDelay?: number;
}

interface LazyComponentState {
  Component: React.ComponentType<any> | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
}

/**
 * Hook para carregamento lazy de componentes React
 * Otimiza a performance carregando componentes apenas quando necessário
 */
export function useLazyComponent<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: LazyComponentOptions = {}
) {
  const {
    fallback = React.createElement('div', { className: 'lazy-loading' }, 'Carregando...'),
    delay = 0,
    retryCount: maxRetries = 3,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<LazyComponentState>({
    Component: null,
    loading: false,
    error: null,
    retryCount: 0
  });

  const loadComponent = useCallback(async () => {
    if (state.Component || state.loading) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Delay opcional para evitar carregamentos desnecessários
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const module = await importFn();
      setState({
        Component: module.default,
        loading: false,
        error: null,
        retryCount: 0
      });
    } catch (error) {
      const newRetryCount = state.retryCount + 1;
      
      if (newRetryCount < maxRetries) {
        // Tentar novamente após delay
        setTimeout(() => {
          setState(prev => ({ ...prev, retryCount: newRetryCount }));
          loadComponent();
        }, retryDelay);
      } else {
        setState({
          Component: null,
          loading: false,
          error: error as Error,
          retryCount: newRetryCount
        });
      }
    }
  }, [importFn, delay, maxRetries, retryDelay, state.Component, state.loading, state.retryCount]);

  const retry = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0 }));
    loadComponent();
  }, [loadComponent]);

  return {
    Component: state.Component,
    loading: state.loading,
    error: state.error,
    retryCount: state.retryCount,
    load: loadComponent,
    retry
  };
}

/**
 * Hook para carregamento lazy com Intersection Observer
 * Carrega o componente quando ele entra na viewport
 */
export function useLazyComponentWithIntersection<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: LazyComponentOptions & { rootMargin?: string; threshold?: number } = {}
) {
  const { rootMargin = '50px', threshold = 0.1, ...lazyOptions } = options;
  const lazyComponent = useLazyComponent(importFn, lazyOptions);

  useEffect(() => {
    if (lazyComponent.Component || lazyComponent.loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lazyComponent.load();
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    // Observar o elemento quando ele for montado
    const element = document.querySelector('[data-lazy-component]');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [lazyComponent, rootMargin, threshold]);

  return lazyComponent;
}
