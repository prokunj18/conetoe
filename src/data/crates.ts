import { CrateType } from "@/types/customization";

export const CRATES: CrateType[] = [
  {
    rarity: 'rare',
    cost: 25,
    name: 'Rare Crate',
    color: 'from-blue-600 to-cyan-700',
    gradient: 'bg-gradient-to-br from-blue-600 to-cyan-700'
  },
  {
    rarity: 'epic',
    cost: 50,
    name: 'Epic Crate',
    color: 'from-purple-600 to-pink-700',
    gradient: 'bg-gradient-to-br from-purple-600 to-pink-700'
  },
  {
    rarity: 'mythic',
    cost: 75,
    name: 'Mythic Crate',
    color: 'from-red-600 to-orange-700',
    gradient: 'bg-gradient-to-br from-red-600 to-orange-700'
  },
  {
    rarity: 'legendary',
    cost: 100,
    name: 'Legendary Crate',
    color: 'from-yellow-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  }
];