import type { MistakeRecord, TenseProgress, TestResult } from "@/types";

export function scoreLabel(score: number, total = 18) {
  const normalized = Math.round((score / Math.max(total, 1)) * 18);
  if (normalized <= 9) return { label: "Қайталау қажет", className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" };
  if (normalized <= 12) return { label: "Жақсы, бірақ тұрақсыз", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" };
  if (normalized <= 15) return { label: "Емтиханға жақын деңгей", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" };
  return { label: "Өте жақсы нәтиже", className: "bg-green-200 text-green-900 dark:bg-green-950 dark:text-green-200" };
}

export function averagePercent(results: TestResult[]) {
  if (!results.length) return 0;
  return Math.round(results.reduce((sum, item) => sum + item.percentage, 0) / results.length);
}

export function totalAnswers(results: TestResult[]) {
  return results.reduce((acc, result) => {
    acc.correct += result.score;
    acc.wrong += result.total - result.score;
    return acc;
  }, { correct: 0, wrong: 0 });
}

export function streakCount(activityDates: string[]) {
  const unique = new Set(activityDates);
  let count = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!unique.has(key)) break;
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function dueMistakes(mistakes: Record<string, MistakeRecord>) {
  const now = Date.now();
  return Object.values(mistakes).filter((item) => item.status !== "Меңгерілді" && new Date(item.nextReviewAt).getTime() <= now);
}

export function masteredTopics(progress: Record<string, TenseProgress>) {
  return Object.values(progress).filter((item) => item.status === "Меңгерілді").length;
}
