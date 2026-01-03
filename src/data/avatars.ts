export interface AvatarData {
  id: string;
  emoji: string;
  name: string;
  tier: 'common' | 'rare' | 'epic' | 'legendary';
  unlockType: 'default' | 'bling' | 'achievement' | 'level';
  unlockRequirement?: number | string;
  cost?: number;
}

export const AVATARS: AvatarData[] = [
  // COMMON - Free/Default (4)
  { id: 'avatar1', emoji: '🤖', name: 'Robot', tier: 'common', unlockType: 'default' },
  { id: 'avatar2', emoji: '👨‍🚀', name: 'Astronaut', tier: 'common', unlockType: 'default' },
  { id: 'avatar3', emoji: '⚔️', name: 'Knight', tier: 'common', unlockType: 'default' },
  { id: 'avatar4', emoji: '🧙', name: 'Wizard', tier: 'common', unlockType: 'default' },

  // RARE - Bling Purchase (8)
  { id: 'avatar5', emoji: '🥷', name: 'Ninja', tier: 'rare', unlockType: 'bling', cost: 500 },
  { id: 'avatar6', emoji: '🏴‍☠️', name: 'Pirate', tier: 'rare', unlockType: 'bling', cost: 500 },
  { id: 'avatar7', emoji: '🔬', name: 'Scientist', tier: 'rare', unlockType: 'bling', cost: 600 },
  { id: 'avatar8', emoji: '🧭', name: 'Explorer', tier: 'rare', unlockType: 'bling', cost: 600 },
  { id: 'avatar9', emoji: '🎮', name: 'Gamer', tier: 'rare', unlockType: 'bling', cost: 750 },
  { id: 'avatar10', emoji: '🎨', name: 'Artist', tier: 'rare', unlockType: 'bling', cost: 750 },
  { id: 'avatar11', emoji: '🧬', name: 'Geneticist', tier: 'rare', unlockType: 'bling', cost: 800 },
  { id: 'avatar12', emoji: '🦸', name: 'Hero', tier: 'rare', unlockType: 'bling', cost: 800 },

  // EPIC - Level Unlock (6)
  { id: 'avatar13', emoji: '🐉', name: 'Dragon', tier: 'epic', unlockType: 'level', unlockRequirement: 10 },
  { id: 'avatar14', emoji: '👑', name: 'Royal', tier: 'epic', unlockType: 'level', unlockRequirement: 15 },
  { id: 'avatar15', emoji: '🌋', name: 'Volcano', tier: 'epic', unlockType: 'level', unlockRequirement: 20 },
  { id: 'avatar16', emoji: '⚡', name: 'Thunder', tier: 'epic', unlockType: 'level', unlockRequirement: 25 },
  { id: 'avatar17', emoji: '🌊', name: 'Tsunami', tier: 'epic', unlockType: 'level', unlockRequirement: 30 },
  { id: 'avatar18', emoji: '🔥', name: 'Inferno', tier: 'epic', unlockType: 'level', unlockRequirement: 35 },

  // LEGENDARY - Achievement Unlock (4)
  { id: 'avatar19', emoji: '🦄', name: 'Unicorn', tier: 'legendary', unlockType: 'achievement', unlockRequirement: 'first_win' },
  { id: 'avatar20', emoji: '🌟', name: 'Celestial', tier: 'legendary', unlockType: 'achievement', unlockRequirement: 'win_streak_10' },
  { id: 'avatar21', emoji: '🌌', name: 'Galaxy', tier: 'legendary', unlockType: 'achievement', unlockRequirement: 'master_victory' },
  { id: 'avatar22', emoji: '💎', name: 'Diamond', tier: 'legendary', unlockType: 'achievement', unlockRequirement: 'win_100' },
];

export const getTierStyles = (tier: string) => {
  switch (tier) {
    case 'legendary': 
      return 'from-yellow-400 to-orange-500 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]';
    case 'epic': 
      return 'from-purple-500 to-pink-600 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]';
    case 'rare': 
      return 'from-blue-500 to-cyan-600 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]';
    default: 
      return 'from-slate-500 to-slate-600 border-slate-500';
  }
};

export const getUnlockText = (avatar: AvatarData): string => {
  switch (avatar.unlockType) {
    case 'default':
      return 'Free';
    case 'bling':
      return `${avatar.cost} Bling`;
    case 'level':
      return `Level ${avatar.unlockRequirement}`;
    case 'achievement':
      return getAchievementName(avatar.unlockRequirement as string);
    default:
      return 'Unknown';
  }
};

const getAchievementName = (achievementId: string): string => {
  const names: Record<string, string> = {
    'first_win': 'First Victory',
    'win_streak_10': '10 Win Streak',
    'master_victory': 'Beat Master AI',
    'win_100': '100 Wins',
  };
  return names[achievementId] || achievementId;
};
