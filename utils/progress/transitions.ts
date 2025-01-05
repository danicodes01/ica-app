// utils/progress/transitions.ts
import { ProgressStatus } from '@/types/base/enums';

export const validTransitions: Record<ProgressStatus, ProgressStatus[]> = {
  [ProgressStatus.NOT_STARTED]: [ProgressStatus.IN_PROGRESS],
  [ProgressStatus.IN_PROGRESS]: [ProgressStatus.COMPLETED, ProgressStatus.FAILED],
  [ProgressStatus.COMPLETED]: [],
  [ProgressStatus.FAILED]: [ProgressStatus.IN_PROGRESS]
};

export const isValidTransition = (from: ProgressStatus, to: ProgressStatus): boolean => {
  return validTransitions[from].includes(to);
};

// Helper to get next valid states
export const getValidNextStates = (currentStatus: ProgressStatus): ProgressStatus[] => {
  return validTransitions[currentStatus] || [];
};