import { renderHook, act } from '@testing-library/react';
import { useGlobalState } from '../../src/hooks/useGlobalState';

describe('useGlobalState Hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useGlobalState());
    expect(result.current).toBeDefined();
  });
});
