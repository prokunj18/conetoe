export type Rarity = 'rare' | 'epic' | 'mythic' | 'legendary';

export interface ConeData {
  id: string;
  name: string;
  rarity: Rarity;
  gradient: string;
  preview: string;
  effect?: string;
}

export interface BoardData {
  id: string;
  name: string;
  rarity: Rarity;
  gradient: string;
  preview: string;
  description: string;
}

export interface CrateType {
  rarity: Rarity;
  cost: number;
  name: string;
  color: string;
  gradient: string;
}

export interface UserInventory {
  ownedCones: string[];
  ownedBoards: string[];
}