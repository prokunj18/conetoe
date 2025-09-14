import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BoardTheme = 'futuristic' | 'wooden';

interface SettingsContextType {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  showMoveHints: boolean;
  boardTheme: BoardTheme;
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setShowMoveHints: (enabled: boolean) => void;
  setBoardTheme: (theme: BoardTheme) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showMoveHints, setShowMoveHints] = useState(() => {
    const saved = localStorage.getItem('showMoveHints');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [boardTheme, setBoardTheme] = useState<BoardTheme>(() => {
    const saved = localStorage.getItem('boardTheme');
    return saved !== null ? JSON.parse(saved) : 'futuristic';
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('animationsEnabled', JSON.stringify(animationsEnabled));
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('showMoveHints', JSON.stringify(showMoveHints));
  }, [showMoveHints]);

  useEffect(() => {
    localStorage.setItem('boardTheme', JSON.stringify(boardTheme));
  }, [boardTheme]);

  // Apply animation setting to document
  useEffect(() => {
    if (animationsEnabled) {
      document.documentElement.classList.remove('animations-disabled');
    } else {
      document.documentElement.classList.add('animations-disabled');
    }
  }, [animationsEnabled]);

  const value = {
    soundEnabled,
    animationsEnabled,
    showMoveHints,
    boardTheme,
    setSoundEnabled,
    setAnimationsEnabled,
    setShowMoveHints,
    setBoardTheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};