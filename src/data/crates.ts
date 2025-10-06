import { CrateType } from "@/types/customization";

export const CRATES: CrateType[] = [
  {
    rarity: 'rare',
    cost: 25,
    name: 'Rare Crate',
    color: 'from-blue-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600'
  },
  {
    rarity: 'epic',
    cost: 50,
    name: 'Epic Crate',
    color: 'from-purple-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
  },
  {
    rarity: 'mythic',
    cost: 75,
    name: 'Mythic Crate',
    color: 'from-red-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-red-500 to-orange-600'
  },
  {
    rarity: 'legendary',
    cost: 100,
    name: 'Legendary Crate',
    color: 'from-yellow-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500'
  }
];