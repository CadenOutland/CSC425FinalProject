import { createContext, useContext, useState, useCallback } from 'react';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({});

  const updateProgress = useCallback((goalId, newProgress) => {
    setProgress(prev => ({
      ...prev,
      [goalId]: newProgress
    }));
  }, []);

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}