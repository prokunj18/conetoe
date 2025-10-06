import { BoardData } from "@/types/customization";

export const BOARDS: BoardData[] = [
  // RARE (20 items)
  { id: "neon", name: "Neon Cyber", rarity: "rare", gradient: "bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700", preview: "border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.4)]", description: "Vibrant neon glow" },
  { id: "wooden", name: "Classic Wood", rarity: "rare", gradient: "bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900", preview: "border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.3)]", description: "Traditional warmth" },
  { id: "ocean", name: "Ocean Depths", rarity: "rare", gradient: "bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-600", preview: "border-teal-400/60 shadow-[0_0_20px_rgba(20,184,166,0.5)]", description: "Aquatic serenity" },
  { id: "forest", name: "Forest Grove", rarity: "rare", gradient: "bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800", preview: "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]", description: "Natural woodland" },
  { id: "desert", name: "Desert Sands", rarity: "rare", gradient: "bg-gradient-to-br from-yellow-600 via-orange-700 to-amber-800", preview: "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]", description: "Sandy dunes" },
  { id: "arctic", name: "Arctic Tundra", rarity: "rare", gradient: "bg-gradient-to-br from-blue-100 via-cyan-200 to-blue-300", preview: "border-cyan-300/60 shadow-[0_0_20px_rgba(103,232,249,0.4)]", description: "Frozen wasteland" },
  { id: "volcano", name: "Volcanic Ash", rarity: "rare", gradient: "bg-gradient-to-br from-gray-800 via-red-900 to-orange-900", preview: "border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.4)]", description: "Molten rock" },
  { id: "midnight", name: "Midnight Blue", rarity: "rare", gradient: "bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900", preview: "border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]", description: "Dark elegance" },
  { id: "sunset", name: "Sunset Sky", rarity: "rare", gradient: "bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-500", preview: "border-orange-400/60 shadow-[0_0_25px_rgba(251,146,60,0.5)]", description: "Warm horizons" },
  { id: "marble", name: "Marble Hall", rarity: "rare", gradient: "bg-gradient-to-br from-gray-100 via-slate-300 to-gray-400", preview: "border-slate-400/50 shadow-[0_0_15px_rgba(148,163,184,0.3)]", description: "Polished stone" },
  { id: "jade", name: "Jade Temple", rarity: "rare", gradient: "bg-gradient-to-br from-green-600 via-emerald-700 to-green-800", preview: "border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.4)]", description: "Sacred stone" },
  { id: "bronze", name: "Bronze Age", rarity: "rare", gradient: "bg-gradient-to-br from-amber-600 via-orange-700 to-brown-800", preview: "border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.3)]", description: "Ancient metal" },
  { id: "silver", name: "Silver Plate", rarity: "rare", gradient: "bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500", preview: "border-gray-400/60 shadow-[0_0_20px_rgba(156,163,175,0.4)]", description: "Shining metal" },
  { id: "coral", name: "Coral Reef", rarity: "rare", gradient: "bg-gradient-to-br from-pink-500 via-red-500 to-orange-600", preview: "border-pink-400/60 shadow-[0_0_20px_rgba(244,114,182,0.4)]", description: "Underwater life" },
  { id: "moss", name: "Moss Garden", rarity: "rare", gradient: "bg-gradient-to-br from-green-600 via-lime-700 to-green-800", preview: "border-lime-500/50 shadow-[0_0_15px_rgba(132,204,22,0.3)]", description: "Verdant growth" },
  { id: "clay", name: "Clay Court", rarity: "rare", gradient: "bg-gradient-to-br from-red-700 via-orange-800 to-brown-900", preview: "border-orange-600/50 shadow-[0_0_15px_rgba(234,88,12,0.3)]", description: "Earthy terrain" },
  { id: "ice", name: "Ice Rink", rarity: "rare", gradient: "bg-gradient-to-br from-cyan-100 via-blue-200 to-cyan-300", preview: "border-cyan-300/60 shadow-[0_0_20px_rgba(103,232,249,0.4)]", description: "Frozen surface" },
  { id: "sand", name: "Sand Beach", rarity: "rare", gradient: "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600", preview: "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]", description: "Coastal shore" },
  { id: "stone", name: "Stone Path", rarity: "rare", gradient: "bg-gradient-to-br from-gray-600 via-slate-700 to-gray-800", preview: "border-slate-500/50 shadow-[0_0_15px_rgba(100,116,139,0.3)]", description: "Rocky ground" },
  { id: "grass", name: "Grass Field", rarity: "rare", gradient: "bg-gradient-to-br from-green-500 via-lime-600 to-green-700", preview: "border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.4)]", description: "Fresh meadow" },

  // EPIC (15 items)
  { id: "crystal", name: "Crystal Ice", rarity: "epic", gradient: "bg-gradient-to-br from-blue-100 via-cyan-200 to-blue-300", preview: "border-cyan-300/60 shadow-[0_0_25px_rgba(103,232,249,0.5)]", description: "Frozen elegance" },
  { id: "lava", name: "Lava Flow", rarity: "epic", gradient: "bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500", preview: "border-orange-500/60 shadow-[0_0_30px_rgba(249,115,22,0.6)]", description: "Molten intensity" },
  { id: "space", name: "Deep Space", rarity: "epic", gradient: "bg-gradient-to-br from-indigo-950 via-purple-900 to-black", preview: "border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]", description: "Cosmic darkness" },
  { id: "matrix", name: "Matrix Grid", rarity: "epic", gradient: "bg-gradient-to-br from-green-950 via-emerald-900 to-black", preview: "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]", description: "Digital reality" },
  { id: "royal", name: "Royal Gold", rarity: "epic", gradient: "bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-700", preview: "border-yellow-500/60 shadow-[0_0_25px_rgba(234,179,8,0.5)]", description: "Regal luxury" },
  { id: "obsidian", name: "Obsidian Void", rarity: "epic", gradient: "bg-gradient-to-br from-gray-900 via-black to-slate-900", preview: "border-gray-700/50 shadow-[0_0_20px_rgba(55,65,81,0.4)]", description: "Dark glass" },
  { id: "emerald", name: "Emerald Palace", rarity: "epic", gradient: "bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700", preview: "border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.5)]", description: "Jeweled throne" },
  { id: "ruby", name: "Ruby Chamber", rarity: "epic", gradient: "bg-gradient-to-br from-red-500 via-rose-600 to-red-700", preview: "border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.5)]", description: "Crimson gem" },
  { id: "sapphire", name: "Sapphire Depths", rarity: "epic", gradient: "bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700", preview: "border-blue-500/60 shadow-[0_0_25px_rgba(59,130,246,0.5)]", description: "Deep blue gem" },
  { id: "amethyst", name: "Amethyst Cave", rarity: "epic", gradient: "bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700", preview: "border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.5)]", description: "Purple crystal" },
  { id: "platinum", name: "Platinum Deck", rarity: "epic", gradient: "bg-gradient-to-br from-gray-200 via-slate-300 to-gray-400", preview: "border-gray-400/70 shadow-[0_0_25px_rgba(156,163,175,0.5)]", description: "Precious metal" },
  { id: "copper", name: "Copper Mine", rarity: "epic", gradient: "bg-gradient-to-br from-orange-600 via-red-700 to-orange-800", preview: "border-orange-600/60 shadow-[0_0_20px_rgba(234,88,12,0.4)]", description: "Rustic metal" },
  { id: "titanium", name: "Titanium Grid", rarity: "epic", gradient: "bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600", preview: "border-slate-500/60 shadow-[0_0_20px_rgba(100,116,139,0.4)]", description: "Strong alloy" },
  { id: "opal", name: "Opal Shimmer", rarity: "epic", gradient: "bg-gradient-to-br from-pink-300 via-blue-300 to-purple-300", preview: "border-pink-400/60 shadow-[0_0_25px_rgba(244,114,182,0.5)]", description: "Iridescent gem" },
  { id: "onyx", name: "Onyx Shrine", rarity: "epic", gradient: "bg-gradient-to-br from-black via-gray-900 to-black", preview: "border-gray-800/70 shadow-[0_0_20px_rgba(31,41,55,0.5)]", description: "Pure darkness" },

  // MYTHIC (7 items)
  { id: "nebula", name: "Nebula Storm", rarity: "mythic", gradient: "bg-gradient-to-br from-purple-600 via-pink-600 to-blue-700", preview: "border-purple-500/80 shadow-[0_0_40px_rgba(168,85,247,0.7)]", description: "Cosmic clouds" },
  { id: "inferno", name: "Inferno Pit", rarity: "mythic", gradient: "bg-gradient-to-br from-yellow-400 via-red-600 to-black", preview: "border-red-600/80 shadow-[0_0_40px_rgba(220,38,38,0.7)]", description: "Hellfire realm" },
  { id: "aurora", name: "Aurora Borealis", rarity: "mythic", gradient: "bg-gradient-to-br from-green-300 via-cyan-400 to-purple-500", preview: "border-cyan-400/80 shadow-[0_0_40px_rgba(34,211,238,0.7)]", description: "Northern lights" },
  { id: "void", name: "Void Dimension", rarity: "mythic", gradient: "bg-gradient-to-br from-purple-950 via-black to-indigo-950", preview: "border-purple-700/80 shadow-[0_0_40px_rgba(88,28,135,0.7)]", description: "Empty space" },
  { id: "celestial", name: "Celestial Realm", rarity: "mythic", gradient: "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600", preview: "border-indigo-500/80 shadow-[0_0_40px_rgba(99,102,241,0.7)]", description: "Heavenly domain" },
  { id: "abyss", name: "Abyssal Depth", rarity: "mythic", gradient: "bg-gradient-to-br from-blue-950 via-black to-cyan-950", preview: "border-blue-800/80 shadow-[0_0_40px_rgba(30,58,138,0.7)]", description: "Endless dark" },
  { id: "phoenix", name: "Phoenix Nest", rarity: "mythic", gradient: "bg-gradient-to-br from-orange-400 via-red-600 to-pink-700", preview: "border-orange-500/80 shadow-[0_0_40px_rgba(249,115,22,0.7)]", description: "Rebirth flame" },

  // LEGENDARY (5 items)
  { id: "cosmic", name: "Cosmic Nexus", rarity: "legendary", gradient: "bg-gradient-to-br from-purple-400 via-pink-500 via-orange-400 to-yellow-500", preview: "border-pink-500/100 shadow-[0_0_60px_rgba(236,72,153,0.9)]", description: "Universal center" },
  { id: "prismatic", name: "Prismatic Realm", rarity: "legendary", gradient: "bg-gradient-to-br from-red-400 via-yellow-300 via-green-400 via-blue-500 to-purple-600", preview: "border-yellow-400/100 shadow-[0_0_60px_rgba(250,204,21,0.9)]", description: "Rainbow dimension" },
  { id: "eternal", name: "Eternal Sanctuary", rarity: "legendary", gradient: "bg-gradient-to-br from-white via-yellow-300 via-orange-500 to-red-800", preview: "border-yellow-300/100 shadow-[0_0_60px_rgba(253,224,71,0.9)]", description: "Timeless haven" },
  { id: "divine", name: "Divine Throne", rarity: "legendary", gradient: "bg-gradient-to-br from-white via-cyan-300 via-blue-400 to-indigo-600", preview: "border-cyan-300/100 shadow-[0_0_60px_rgba(103,232,249,0.9)]", description: "Godly seat" },
  { id: "chaos", name: "Chaos Dimension", rarity: "legendary", gradient: "bg-gradient-to-br from-black via-purple-600 via-pink-500 to-red-600", preview: "border-purple-500/100 shadow-[0_0_60px_rgba(168,85,247,0.9)]", description: "Pure chaos" },
];