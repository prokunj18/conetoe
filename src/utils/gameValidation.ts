import { CONES } from '@/data/cones';
import { BOARDS } from '@/data/boards';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Default fallback assets
export const DEFAULT_CONE_ID = 'classic';
export const DEFAULT_BOARD_ID = 'neon';

// Validate that a cone exists
export const validateCone = (coneId: string): boolean => {
  return CONES.some(cone => cone.id === coneId);
};

// Validate that a board exists
export const validateBoard = (boardId: string): boolean => {
  return BOARDS.some(board => board.id === boardId);
};

// Validate cone + board combination
export const validateCombination = (coneId: string, boardId: string): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check if cone exists
  if (!validateCone(coneId)) {
    result.errors.push(`Cone "${coneId}" not found`);
    result.isValid = false;
  }

  // Check if board exists
  if (!validateBoard(boardId)) {
    result.errors.push(`Board "${boardId}" not found`);
    result.isValid = false;
  }

  // All cone + board combinations are valid by design
  // Add any specific incompatibility checks here if needed in future

  return result;
};

// Get safe cone (fallback if invalid)
export const getSafeCone = (coneId: string): string => {
  return validateCone(coneId) ? coneId : DEFAULT_CONE_ID;
};

// Get safe board (fallback if invalid)
export const getSafeBoard = (boardId: string): string => {
  return validateBoard(boardId) ? boardId : DEFAULT_BOARD_ID;
};

// Validate all combinations (for testing/verification)
export const validateAllCombinations = (): {
  total: number;
  valid: number;
  invalid: { cone: string; board: string; errors: string[] }[];
} => {
  const results = {
    total: 0,
    valid: 0,
    invalid: [] as { cone: string; board: string; errors: string[] }[]
  };

  CONES.forEach(cone => {
    BOARDS.forEach(board => {
      results.total++;
      const validation = validateCombination(cone.id, board.id);
      
      if (validation.isValid) {
        results.valid++;
      } else {
        results.invalid.push({
          cone: cone.id,
          board: board.id,
          errors: validation.errors
        });
      }
    });
  });

  return results;
};

// Safe mode check - returns default assets if current selection is invalid
export const getSafeAssets = (coneId: string, boardId: string): {
  coneId: string;
  boardId: string;
  usedFallback: boolean;
} => {
  const safeCone = getSafeCone(coneId);
  const safeBoard = getSafeBoard(boardId);
  const usedFallback = safeCone !== coneId || safeBoard !== boardId;

  return {
    coneId: safeCone,
    boardId: safeBoard,
    usedFallback
  };
};
