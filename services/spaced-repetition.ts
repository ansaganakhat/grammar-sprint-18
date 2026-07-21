import { addDaysIso } from "@/lib/utils";

export const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30];

export function nextReviewDate(intervalIndex: number, correct: boolean): { intervalIndex: number; nextReviewAt: string } {
  if (!correct) {
    return { intervalIndex: 1, nextReviewAt: addDaysIso(1) };
  }
  const nextIndex = Math.min(intervalIndex + 1, REVIEW_INTERVALS.length - 1);
  return { intervalIndex: nextIndex, nextReviewAt: addDaysIso(REVIEW_INTERVALS[nextIndex]) };
}
