export type QuestTier = 'daily' | 'weekly' | 'epic';

export interface Quest {
  id: string;
  title: string;
  description: string;
  tier: QuestTier;
  target: number;
  reward: {
    bling: number;
    exp: number;
  };
  trackingKey: string; // Used to track progress in localStorage
}

export const QUESTS: Quest[] = [
  // DAILY QUESTS - Quick & Easy (3)
  {
    id: 'daily_play_3',
    title: 'Daily Grind',
    description: 'Play 3 games today',
    tier: 'daily',
    target: 3,
    reward: { bling: 50, exp: 25 },
    trackingKey: 'games_played_today'
  },
  {
    id: 'daily_win_1',
    title: 'First Blood',
    description: 'Win 1 game today',
    tier: 'daily',
    target: 1,
    reward: { bling: 75, exp: 40 },
    trackingKey: 'wins_today'
  },
  {
    id: 'daily_classic_1',
    title: 'Classic Fan',
    description: 'Play 1 Classic mode game',
    tier: 'daily',
    target: 1,
    reward: { bling: 40, exp: 20 },
    trackingKey: 'classic_games_today'
  },

  // WEEKLY QUESTS - Grind-based (3)
  {
    id: 'weekly_play_20',
    title: 'Dedicated Player',
    description: 'Play 20 games this week',
    tier: 'weekly',
    target: 20,
    reward: { bling: 300, exp: 150 },
    trackingKey: 'games_played_week'
  },
  {
    id: 'weekly_win_10',
    title: 'Victory Rush',
    description: 'Win 10 games this week',
    tier: 'weekly',
    target: 10,
    reward: { bling: 500, exp: 250 },
    trackingKey: 'wins_week'
  },
  {
    id: 'weekly_both_modes',
    title: 'Versatile',
    description: 'Win in both Conetoe and Classic modes',
    tier: 'weekly',
    target: 2,
    reward: { bling: 350, exp: 175 },
    trackingKey: 'mode_wins_week'
  },

  // EPIC QUESTS - Skill-based high reward (3)
  {
    id: 'epic_win_streak_5',
    title: 'On Fire',
    description: 'Win 5 games in a row',
    tier: 'epic',
    target: 5,
    reward: { bling: 1000, exp: 500 },
    trackingKey: 'current_win_streak'
  },
  {
    id: 'epic_beat_hard',
    title: 'AI Slayer',
    description: 'Defeat Hard AI 3 times',
    tier: 'epic',
    target: 3,
    reward: { bling: 800, exp: 400 },
    trackingKey: 'hard_ai_wins'
  },
  {
    id: 'epic_beat_master',
    title: 'Legendary Warrior',
    description: 'Defeat Master AI',
    tier: 'epic',
    target: 1,
    reward: { bling: 2000, exp: 1000 },
    trackingKey: 'master_ai_wins'
  }
];

export const getTierColor = (tier: QuestTier) => {
  switch (tier) {
    case 'daily':
      return 'from-emerald-500 to-green-600';
    case 'weekly':
      return 'from-blue-500 to-indigo-600';
    case 'epic':
      return 'from-amber-500 to-orange-600';
    default:
      return 'from-slate-500 to-slate-600';
  }
};

export const getTierLabel = (tier: QuestTier) => {
  switch (tier) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'epic':
      return 'Epic';
    default:
      return tier;
  }
};

export const getTierIcon = (tier: QuestTier) => {
  switch (tier) {
    case 'daily':
      return '⚡';
    case 'weekly':
      return '📅';
    case 'epic':
      return '🏆';
    default:
      return '❓';
  }
};
