import { ConeData } from "@/types/customization";

export const CONES: ConeData[] = [
  // RARE (20 items)
  { id: "classic", name: "Classic", rarity: "rare", gradient: "bg-gradient-to-br from-cyan-400 to-blue-600", preview: "linear-gradient(135deg, #22d3ee, #2563eb)" },
  { id: "fire", name: "Fire", rarity: "rare", gradient: "bg-gradient-to-br from-red-500 to-orange-600", preview: "linear-gradient(135deg, #ef4444, #ea580c)" },
  { id: "emerald", name: "Emerald", rarity: "rare", gradient: "bg-gradient-to-br from-emerald-400 to-green-600", preview: "linear-gradient(135deg, #34d399, #16a34a)" },
  { id: "ruby", name: "Ruby", rarity: "rare", gradient: "bg-gradient-to-br from-red-400 to-pink-600", preview: "linear-gradient(135deg, #f87171, #db2777)" },
  { id: "sapphire", name: "Sapphire", rarity: "rare", gradient: "bg-gradient-to-br from-blue-400 to-indigo-600", preview: "linear-gradient(135deg, #60a5fa, #4f46e5)" },
  { id: "amethyst", name: "Amethyst", rarity: "rare", gradient: "bg-gradient-to-br from-purple-400 to-violet-600", preview: "linear-gradient(135deg, #c084fc, #7c3aed)" },
  { id: "jade", name: "Jade", rarity: "rare", gradient: "bg-gradient-to-br from-green-300 to-emerald-700", preview: "linear-gradient(135deg, #86efac, #047857)" },
  { id: "topaz", name: "Topaz", rarity: "rare", gradient: "bg-gradient-to-br from-yellow-400 to-amber-600", preview: "linear-gradient(135deg, #facc15, #d97706)" },
  { id: "silver", name: "Silver", rarity: "rare", gradient: "bg-gradient-to-br from-gray-300 to-slate-500", preview: "linear-gradient(135deg, #d1d5db, #64748b)" },
  { id: "copper", name: "Copper", rarity: "rare", gradient: "bg-gradient-to-br from-orange-400 to-red-700", preview: "linear-gradient(135deg, #fb923c, #b91c1c)" },
  { id: "steel", name: "Steel", rarity: "rare", gradient: "bg-gradient-to-br from-slate-400 to-gray-600", preview: "linear-gradient(135deg, #94a3b8, #4b5563)" },
  { id: "bronze", name: "Bronze", rarity: "rare", gradient: "bg-gradient-to-br from-amber-600 to-orange-800", preview: "linear-gradient(135deg, #d97706, #9a3412)" },
  { id: "coral", name: "Coral", rarity: "rare", gradient: "bg-gradient-to-br from-pink-400 to-red-500", preview: "linear-gradient(135deg, #f472b6, #ef4444)" },
  { id: "mint", name: "Mint", rarity: "rare", gradient: "bg-gradient-to-br from-teal-300 to-green-500", preview: "linear-gradient(135deg, #5eead4, #22c55e)" },
  { id: "lavender", name: "Lavender", rarity: "rare", gradient: "bg-gradient-to-br from-purple-300 to-indigo-500", preview: "linear-gradient(135deg, #d8b4fe, #6366f1)" },
  { id: "peach", name: "Peach", rarity: "rare", gradient: "bg-gradient-to-br from-orange-300 to-pink-500", preview: "linear-gradient(135deg, #fdba74, #ec4899)" },
  { id: "aqua", name: "Aqua", rarity: "rare", gradient: "bg-gradient-to-br from-cyan-300 to-blue-500", preview: "linear-gradient(135deg, #67e8f9, #3b82f6)" },
  { id: "rose", name: "Rose", rarity: "rare", gradient: "bg-gradient-to-br from-pink-300 to-rose-600", preview: "linear-gradient(135deg, #f9a8d4, #e11d48)" },
  { id: "lime", name: "Lime", rarity: "rare", gradient: "bg-gradient-to-br from-lime-400 to-green-600", preview: "linear-gradient(135deg, #a3e635, #16a34a)" },
  { id: "sky", name: "Sky", rarity: "rare", gradient: "bg-gradient-to-br from-sky-300 to-blue-600", preview: "linear-gradient(135deg, #7dd3fc, #2563eb)" },

  // EPIC (15 items)
  { id: "golden", name: "Golden", rarity: "epic", gradient: "bg-gradient-to-br from-yellow-400 to-orange-500", preview: "linear-gradient(135deg, #facc15, #f97316)" },
  { id: "arctic", name: "Arctic", rarity: "epic", gradient: "bg-gradient-to-br from-blue-200 to-cyan-400", preview: "linear-gradient(135deg, #bfdbfe, #22d3ee)" },
  { id: "shadow", name: "Shadow", rarity: "epic", gradient: "bg-gradient-to-br from-gray-600 to-black", preview: "linear-gradient(135deg, #4b5563, #000000)" },
  { id: "chrome", name: "Chrome", rarity: "epic", gradient: "bg-gradient-to-br from-gray-300 to-gray-500", preview: "linear-gradient(135deg, #d1d5db, #6b7280)" },
  { id: "plasma", name: "Plasma", rarity: "epic", gradient: "bg-gradient-to-br from-pink-400 to-purple-600", preview: "linear-gradient(135deg, #f472b6, #9333ea)" },
  { id: "electric", name: "Electric", rarity: "epic", gradient: "bg-gradient-to-br from-yellow-300 to-blue-600", preview: "linear-gradient(135deg, #fde047, #2563eb)" },
  { id: "poison", name: "Poison", rarity: "epic", gradient: "bg-gradient-to-br from-green-400 to-purple-700", preview: "linear-gradient(135deg, #4ade80, #7e22ce)" },
  { id: "crimson", name: "Crimson", rarity: "epic", gradient: "bg-gradient-to-br from-red-600 to-rose-900", preview: "linear-gradient(135deg, #dc2626, #881337)" },
  { id: "azure", name: "Azure", rarity: "epic", gradient: "bg-gradient-to-br from-blue-400 to-cyan-700", preview: "linear-gradient(135deg, #60a5fa, #0e7490)" },
  { id: "magma", name: "Magma", rarity: "epic", gradient: "bg-gradient-to-br from-orange-500 to-red-900", preview: "linear-gradient(135deg, #f97316, #7f1d1d)" },
  { id: "frost", name: "Frost", rarity: "epic", gradient: "bg-gradient-to-br from-cyan-200 to-blue-800", preview: "linear-gradient(135deg, #a5f3fc, #1e40af)" },
  { id: "venom", name: "Venom", rarity: "epic", gradient: "bg-gradient-to-br from-lime-400 to-green-900", preview: "linear-gradient(135deg, #a3e635, #14532d)" },
  { id: "obsidian", name: "Obsidian", rarity: "epic", gradient: "bg-gradient-to-br from-slate-700 to-black", preview: "linear-gradient(135deg, #334155, #000000)" },
  { id: "pearl", name: "Pearl", rarity: "epic", gradient: "bg-gradient-to-br from-slate-100 to-indigo-300", preview: "linear-gradient(135deg, #f1f5f9, #a5b4fc)" },
  { id: "titanium", name: "Titanium", rarity: "epic", gradient: "bg-gradient-to-br from-gray-400 to-slate-700", preview: "linear-gradient(135deg, #9ca3af, #334155)" },

  // MYTHIC (7 items)
  { id: "galaxy", name: "Galaxy", rarity: "mythic", gradient: "bg-gradient-to-br from-purple-500 to-pink-600", preview: "linear-gradient(135deg, #a855f7, #db2777)", effect: "animate-pulse" },
  { id: "rainbow", name: "Rainbow", rarity: "mythic", gradient: "bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500", preview: "linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6)", effect: "animate-pulse" },
  { id: "celestial", name: "Celestial", rarity: "mythic", gradient: "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600", preview: "linear-gradient(135deg, #818cf8, #a855f7, #db2777)", effect: "animate-pulse" },
  { id: "inferno", name: "Inferno", rarity: "mythic", gradient: "bg-gradient-to-br from-yellow-400 via-red-600 to-black", preview: "linear-gradient(135deg, #facc15, #dc2626, #000000)", effect: "animate-pulse" },
  { id: "void", name: "Void", rarity: "mythic", gradient: "bg-gradient-to-br from-purple-950 via-black to-indigo-950", preview: "linear-gradient(135deg, #2e1065, #000000, #1e1b4b)", effect: "animate-pulse" },
  { id: "aurora", name: "Aurora", rarity: "mythic", gradient: "bg-gradient-to-br from-green-300 via-cyan-400 to-purple-500", preview: "linear-gradient(135deg, #86efac, #22d3ee, #a855f7)", effect: "animate-pulse" },
  { id: "phoenix", name: "Phoenix", rarity: "mythic", gradient: "bg-gradient-to-br from-orange-400 via-red-600 to-pink-700", preview: "linear-gradient(135deg, #fb923c, #dc2626, #be185d)", effect: "animate-pulse" },

  // LEGENDARY (5 items)
  { id: "cosmic", name: "Cosmic Nova", rarity: "legendary", gradient: "bg-gradient-to-br from-purple-400 via-pink-500 via-orange-400 to-yellow-500", preview: "linear-gradient(135deg, #c084fc, #ec4899, #fb923c, #eab308)", effect: "animate-glow-pulse" },
  { id: "prismatic", name: "Prismatic", rarity: "legendary", gradient: "bg-gradient-to-br from-red-400 via-yellow-300 via-green-400 via-blue-500 to-purple-600", preview: "linear-gradient(135deg, #f87171, #fde047, #4ade80, #3b82f6, #9333ea)", effect: "animate-glow-pulse" },
  { id: "eternal", name: "Eternal Flame", rarity: "legendary", gradient: "bg-gradient-to-br from-white via-yellow-300 via-orange-500 to-red-800", preview: "linear-gradient(135deg, #ffffff, #fde047, #f97316, #991b1b)", effect: "animate-glow-pulse" },
  { id: "divine", name: "Divine Light", rarity: "legendary", gradient: "bg-gradient-to-br from-white via-cyan-300 via-blue-400 to-indigo-600", preview: "linear-gradient(135deg, #ffffff, #67e8f9, #60a5fa, #4f46e5)", effect: "animate-glow-pulse" },
  { id: "chaos", name: "Chaos Storm", rarity: "legendary", gradient: "bg-gradient-to-br from-black via-purple-600 via-pink-500 to-red-600", preview: "linear-gradient(135deg, #000000, #9333ea, #ec4899, #dc2626)", effect: "animate-glow-pulse" },
];