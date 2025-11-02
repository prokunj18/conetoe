import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BoardTheme = 'neon' | 'wooden' | 'crystal' | 'lava' | 'space' | 'matrix' | 'royal' | 'ocean' | 'midnight' | 'sunset';
export type ConeStyle = 'classic' | 'fire' | 'emerald' | 'galaxy' | 'golden' | 'arctic' | 'shadow' | 'rainbow' | 'chrome' | 'plasma';
export type GameMode = '2D' | '3D';

interface SettingsContextType {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  showMoveHints: boolean;
  boardTheme: BoardTheme;
  coneStyle: ConeStyle;
  gameMode: GameMode;
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setShowMoveHints: (enabled: boolean) => void;
  setBoardTheme: (theme: BoardTheme) => void;
  setConeStyle: (style: ConeStyle) => void;
  setGameMode: (mode: GameMode) => void;
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
    return saved !== null ? JSON.parse(saved) : 'neon';
  });

  const [coneStyle, setConeStyle] = useState<ConeStyle>(() => {
    const saved = localStorage.getItem('coneStyle');
    return saved !== null ? JSON.parse(saved) : 'classic';
  });

  const [gameMode, setGameMode] = useState<GameMode>(() => {
    const saved = localStorage.getItem('gameMode');
    return saved !== null ? JSON.parse(saved) : '3D';
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

  useEffect(() => {
    localStorage.setItem('coneStyle', JSON.stringify(coneStyle));
  }, [coneStyle]);

  useEffect(() => {
    localStorage.setItem('gameMode', JSON.stringify(gameMode));
  }, [gameMode]);

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
    coneStyle,
    gameMode,
    setSoundEnabled,
    setAnimationsEnabled,
    setShowMoveHints,
    setBoardTheme,
    setConeStyle,
    setGameMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};