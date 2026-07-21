import { scoreLabel } from "@/lib/analytics";
import { cn } from "@/lib/utils";
export function ScoreBadge({ score, total = 18, className }: { score: number; total?: number; className?: string }) {
  const item = scoreLabel(score, total);
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", item.className, className)}>{score}/{total} · {item.label}</span>;
}
