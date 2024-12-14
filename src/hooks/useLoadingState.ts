import { useState, useCallback } from 'react';

type OperationType = 'add' | 'edit' | 'delete' | 'analyze';
type LoadingState = Record<string, boolean>;

export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = useCallback((id: string, operation: OperationType, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [`${operation}-${id}`]: isLoading
    }));
  }, []);

  const isLoading = useCallback((id: string, operation: OperationType) => {
    return loadingStates[`${operation}-${id}`] || false;
  }, [loadingStates]);

  return {
    setLoading,
    isLoading
  };
}