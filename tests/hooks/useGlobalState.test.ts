/**
 * Testes para o hook useGlobalState
 */
import { renderHook, act } from '@testing-library/react';
import { useGlobalState } from '../../src/hooks/useGlobalState';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useGlobalState Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('initializes with default state', () => {
    const { result } = renderHook(() => useGlobalState());

    expect(result.current.state).toEqual({
      user: null,
      theme: 'light',
      language: 'pt',
      notifications: [],
      favorites: [],
      isLoading: false,
      error: null
    });
  });

  test('updates state correctly', () => {
    const { result } = renderHook(() => useGlobalState());

    act(() => {
      result.current.setState({ theme: 'dark' });
    });

    expect(result.current.state.theme).toBe('dark');
  });

  test('updates specific properties without affecting others', () => {
    const { result } = renderHook(() => useGlobalState());

    act(() => {
      result.current.setState({ theme: 'dark' });
    });

    expect(result.current.state.theme).toBe('dark');
    expect(result.current.state.language).toBe('pt'); // Deve manter o valor original
  });

  test('handles loading state', () => {
    const { result } = renderHook(() => useGlobalState());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.state.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.state.isLoading).toBe(false);
  });

  test('handles error state', () => {
    const { result } = renderHook(() => useGlobalState());

    const errorMessage = 'Something went wrong';

    act(() => {
      result.current.setError(errorMessage);
    });

    expect(result.current.state.error).toBe(errorMessage);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.state.error).toBe(null);
  });

  test('adds notification', () => {
    const { result } = renderHook(() => useGlobalState());

    const notification = {
      id: '1',
      type: 'success',
      message: 'Test notification',
      timestamp: Date.now()
    };

    act(() => {
      result.current.addNotification(notification);
    });

    expect(result.current.state.notifications).toHaveLength(1);
    expect(result.current.state.notifications[0]).toEqual(notification);
  });

  test('removes notification', () => {
    const { result } = renderHook(() => useGlobalState());

    const notification = {
      id: '1',
      type: 'success',
      message: 'Test notification',
      timestamp: Date.now()
    };

    act(() => {
      result.current.addNotification(notification);
    });

    act(() => {
      result.current.removeNotification('1');
    });

    expect(result.current.state.notifications).toHaveLength(0);
  });

  test('adds favorite', () => {
    const { result } = renderHook(() => useGlobalState());

    const favorite = {
      id: '1',
      name: 'Test Favorite',
      url: '/test',
      icon: 'test-icon'
    };

    act(() => {
      result.current.addFavorite(favorite);
    });

    expect(result.current.state.favorites).toHaveLength(1);
    expect(result.current.state.favorites[0]).toEqual(favorite);
  });

  test('removes favorite', () => {
    const { result } = renderHook(() => useGlobalState());

    const favorite = {
      id: '1',
      name: 'Test Favorite',
      url: '/test',
      icon: 'test-icon'
    };

    act(() => {
      result.current.addFavorite(favorite);
    });

    act(() => {
      result.current.removeFavorite('1');
    });

    expect(result.current.state.favorites).toHaveLength(0);
  });

  test('persists state to localStorage', () => {
    const { result } = renderHook(() => useGlobalState());

    act(() => {
      result.current.setState({ theme: 'dark' });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'globalState',
      expect.stringContaining('"theme":"dark"')
    );
  });

  test('loads state from localStorage on initialization', () => {
    const savedState = {
      user: null,
      theme: 'dark',
      language: 'en',
      notifications: [],
      favorites: [],
      isLoading: false,
      error: null
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));

    const { result } = renderHook(() => useGlobalState());

    expect(result.current.state.theme).toBe('dark');
    expect(result.current.state.language).toBe('en');
  });

  test('handles invalid localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    const { result } = renderHook(() => useGlobalState());

    expect(result.current.state.theme).toBe('light'); // Deve usar valor padrão
  });
});
