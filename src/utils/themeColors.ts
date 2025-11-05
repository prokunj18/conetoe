import { BoardTheme, ConeStyle } from "@/contexts/SettingsContext";

// Board theme color mappings for 3D rendering
export const getBoardThemeColors = (theme: BoardTheme) => {
  const themeMap: Record<BoardTheme, { primary: string; secondary: string; accent: string }> = {
    'neon': { primary: '#00ffff', secondary: '#0066ff', accent: '#ff00ff' },
    'wooden': { primary: '#8B4513', secondary: '#654321', accent: '#D2691E' },
    'crystal': { primary: '#87CEEB', secondary: '#4682B4', accent: '#B0E0E6' },
    'lava': { primary: '#FF4500', secondary: '#FF6347', accent: '#FFD700' },
    'space': { primary: '#4B0082', secondary: '#000000', accent: '#9370DB' },
    'matrix': { primary: '#00FF00', secondary: '#003300', accent: '#00FF00' },
    'royal': { primary: '#FFD700', secondary: '#FFA500', accent: '#FFFF00' },
    'ocean': { primary: '#0077BE', secondary: '#20B2AA', accent: '#00CED1' },
    'midnight': { primary: '#191970', secondary: '#000080', accent: '#1E90FF' },
    'sunset': { primary: '#FF69B4', secondary: '#FF8C00', accent: '#FFFF00' },
  };
  
  return themeMap[theme] || themeMap.neon;
};

// Cone style color mappings for 3D rendering
export const getConeStyleColors = (style: ConeStyle, player: number) => {
  const baseColors = {
    player1: player === 1 ? '#00ffff' : '#ff00ff',
    player2: player === 1 ? '#ff00ff' : '#00ffff',
  };
  
  const styleMap: Record<ConeStyle, { color: string; emissive: string; accent: string }> = {
    'classic': { 
      color: baseColors.player1, 
      emissive: baseColors.player1, 
      accent: baseColors.player2 
    },
    'fire': { 
      color: player === 1 ? '#FF4500' : '#FFD700', 
      emissive: player === 1 ? '#FF6347' : '#FFA500', 
      accent: player === 1 ? '#FFD700' : '#FF4500' 
    },
    'emerald': { 
      color: player === 1 ? '#50C878' : '#00FF00', 
      emissive: player === 1 ? '#2E8B57' : '#32CD32', 
      accent: player === 1 ? '#90EE90' : '#7FFF00' 
    },
    'galaxy': { 
      color: player === 1 ? '#9370DB' : '#FF69B4', 
      emissive: player === 1 ? '#4B0082' : '#8B008B', 
      accent: player === 1 ? '#BA55D3' : '#FF1493' 
    },
    'golden': { 
      color: player === 1 ? '#FFD700' : '#FFA500', 
      emissive: player === 1 ? '#DAA520' : '#FF8C00', 
      accent: player === 1 ? '#FFFF00' : '#FFD700' 
    },
    'arctic': { 
      color: player === 1 ? '#E0FFFF' : '#B0E0E6', 
      emissive: player === 1 ? '#AFEEEE' : '#87CEEB', 
      accent: player === 1 ? '#F0FFFF' : '#ADD8E6' 
    },
    'shadow': { 
      color: player === 1 ? '#36454F' : '#2F4F4F', 
      emissive: player === 1 ? '#000000' : '#191970', 
      accent: player === 1 ? '#708090' : '#4682B4' 
    },
    'rainbow': { 
      color: player === 1 ? '#FF0000' : '#0000FF', 
      emissive: player === 1 ? '#FF69B4' : '#4169E1', 
      accent: player === 1 ? '#FFFF00' : '#00FF00' 
    },
    'chrome': { 
      color: player === 1 ? '#C0C0C0' : '#A9A9A9', 
      emissive: player === 1 ? '#D3D3D3' : '#808080', 
      accent: player === 1 ? '#E8E8E8' : '#696969' 
    },
    'plasma': { 
      color: player === 1 ? '#FF00FF' : '#00FFFF', 
      emissive: player === 1 ? '#FF1493' : '#00CED1', 
      accent: player === 1 ? '#DA70D6' : '#7FFFD4' 
    },
  };
  
  return styleMap[style] || styleMap.classic;
};
