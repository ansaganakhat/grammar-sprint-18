import { cn } from "@/lib/utils";
export function Progress({ value, className, label = "Прогресс" }: { value: number; className?: string; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted", className)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(safe)}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${safe}%` }} /></div>;
}
