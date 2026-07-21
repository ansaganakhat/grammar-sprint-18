import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuizOption({ label, value, selected, locked, correctAnswer, onSelect }: { label: string; value: string; selected: boolean; locked: boolean; correctAnswer: string; onSelect: () => void }) {
  const correct = value === correctAnswer;
  const wrongSelected = locked && selected && !correct;
  return <button type="button" aria-label={`${label} жауабын таңдау: ${value}`} disabled={locked} onClick={onSelect} className={cn("flex min-h-14 w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition", !locked && selected && "border-primary bg-primary/10", !locked && !selected && "hover:border-primary hover:bg-accent", locked && correct && "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200", wrongSelected && "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200")}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border bg-background font-bold">{label}</span><span className="flex-1">{value}</span>{locked && correct && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}{wrongSelected && <XCircle className="h-5 w-5 text-red-600" />}</button>;
}
