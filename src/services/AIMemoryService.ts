/**
 * AI Memory Service - Adaptive Learning System
 * Records board states where AI lost and uses them to avoid similar mistakes
 */

import { CellStack } from "@/types/game";

interface LossPattern {
  boardHash: string;
  timestamp: number;
  occurrences: number;
}

interface AIMemoryLog {
  patterns: LossPattern[];
  totalLosses: number;
  lastUpdated: number;
}

const STORAGE_KEY = 'ai_memory_log';
const MAX_PATTERNS = 100; // Limit memory size
const PATTERN_PENALTY = 500; // Score penalty for known bad patterns

// Convert board state (INCLUDING hidden stacks) to a unique hash for comparison
export const hashBoardState = (board: (CellStack | null)[]): string => {
  return board
    .map((stack) => {
      if (!stack || stack.length === 0) return "0";
      // Encode full stack bottom->top so we don't "forget" hidden threats
      return stack.map((c) => `${c.player}${c.size}`).join("");
    })
    .join("-");
};


// Get normalized board states (considers rotational symmetry)
const getSymmetricHashes = (board: (CellStack | null)[]): string[] => {
  const hashes: string[] = [];
  
  // Original
  hashes.push(hashBoardState(board));
  
  // Rotations (90, 180, 270 degrees)
  const rotate90 = [6, 3, 0, 7, 4, 1, 8, 5, 2];
  const rotate180 = [8, 7, 6, 5, 4, 3, 2, 1, 0];
  const rotate270 = [2, 5, 8, 1, 4, 7, 0, 3, 6];
  
  const rotated90 = rotate90.map(i => board[i]);
  const rotated180 = rotate180.map(i => board[i]);
  const rotated270 = rotate270.map(i => board[i]);
  
  hashes.push(hashBoardState(rotated90));
  hashes.push(hashBoardState(rotated180));
  hashes.push(hashBoardState(rotated270));
  
  // Reflections
  const reflectH = [2, 1, 0, 5, 4, 3, 8, 7, 6];
  const reflectV = [6, 7, 8, 3, 4, 5, 0, 1, 2];
  
  const reflectedH = reflectH.map(i => board[i]);
  const reflectedV = reflectV.map(i => board[i]);
  
  hashes.push(hashBoardState(reflectedH));
  hashes.push(hashBoardState(reflectedV));
  
  return [...new Set(hashes)]; // Remove duplicates
};

class AIMemoryService {
  private memory: AIMemoryLog;
  private gameHistory: string[] = []; // Track board states during current game

  constructor() {
    this.memory = this.loadMemory();
  }

  private loadMemory(): AIMemoryLog {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load AI memory:', e);
    }
    return { patterns: [], totalLosses: 0, lastUpdated: Date.now() };
  }

  private saveMemory(): void {
    try {
      this.memory.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memory));
    } catch (e) {
      console.warn('Failed to save AI memory:', e);
    }
  }

  // Track board state during game
  trackBoardState(board: (CellStack | null)[]): void {
    const hash = hashBoardState(board);
    this.gameHistory.push(hash);
  }

  // Called when game ends - if AI lost, record the patterns
  recordGameResult(won: boolean, board: (CellStack | null)[]): void {
    if (!won) {
      // AI lost - record the final 3 board states as "High Risk Patterns"
      const finalStates = this.gameHistory.slice(-3);
      
      for (const hash of finalStates) {
        const existingPattern = this.memory.patterns.find(p => p.boardHash === hash);
        
        if (existingPattern) {
          existingPattern.occurrences++;
          existingPattern.timestamp = Date.now();
        } else {
          this.memory.patterns.push({
            boardHash: hash,
            timestamp: Date.now(),
            occurrences: 1
          });
        }
      }
      
      this.memory.totalLosses++;
      
      // Prune old patterns if memory is full
      if (this.memory.patterns.length > MAX_PATTERNS) {
        // Remove oldest, least occurred patterns
        this.memory.patterns.sort((a, b) => 
          (b.occurrences * 2 + (b.timestamp / 1000000)) - 
          (a.occurrences * 2 + (a.timestamp / 1000000))
        );
        this.memory.patterns = this.memory.patterns.slice(0, MAX_PATTERNS);
      }
      
      this.saveMemory();
    }
    
    // Reset game history for next game
    this.gameHistory = [];
  }

  // Check if a potential board state matches known losing patterns
  getPatternPenalty(board: (CellStack | null)[]): number {
    const hashes = getSymmetricHashes(board);
    
    for (const hash of hashes) {
      const pattern = this.memory.patterns.find(p => p.boardHash === hash);
      if (pattern) {
        // Higher penalty for patterns that occurred more often
        return PATTERN_PENALTY * Math.min(pattern.occurrences, 5);
      }
    }
    
    return 0;
  }

  // Check if current board is similar to a losing pattern
  isHighRiskPattern(board: (CellStack | null)[]): boolean {
    return this.getPatternPenalty(board) > 0;
  }

  // Get AI stats for debugging/display
  getStats(): { totalLosses: number; patternsLearned: number } {
    return {
      totalLosses: this.memory.totalLosses,
      patternsLearned: this.memory.patterns.length
    };
  }

  // Clear all learned patterns
  resetMemory(): void {
    this.memory = { patterns: [], totalLosses: 0, lastUpdated: Date.now() };
    this.gameHistory = [];
    this.saveMemory();
  }
}

// Singleton instance
export const aiMemory = new AIMemoryService();
