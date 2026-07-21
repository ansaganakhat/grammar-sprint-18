"use client";

import Link from "next/link";
import { tenses } from "@/data/tenses";
import type { TenseFamily, TenseGroup } from "@/types";
import { useAppStore } from "@/store/use-app-store";

const families: TenseFamily[] = ["Simple", "Continuous", "Perfect", "Perfect Continuous"];
const groups: TenseGroup[] = ["Present", "Past", "Future"];

export function TenseMatrix() {
  const overrides = useAppStore((state) => state.tenseOverrides);
  return <div className="overflow-x-auto rounded-2xl border bg-card"><table className="min-w-[760px] w-full text-left"><thead><tr className="border-b bg-muted/50"><th className="p-4 text-sm">Family</th>{groups.map((group) => <th key={group} className="p-4 text-sm">{group}</th>)}</tr></thead><tbody>{families.map((family) => <tr key={family} className="border-b last:border-0"><th className="p-4 text-sm font-semibold">{family}</th>{groups.map((group) => { const base = tenses.find((item) => item.family === family && item.group === group)!; const tense = { ...base, ...overrides[base.id] }; return <td key={group} className="p-3"><Link href={`/formula-cards#${tense.id}`} className="block rounded-xl border bg-background p-3 transition hover:border-primary hover:shadow-sm"><span className="block text-sm font-semibold">{tense.name}</span><span className="mt-1 block max-w-[220px] overflow-x-auto font-mono text-xs text-primary">{tense.positiveFormula}</span></Link></td>; })}</tr>)}</tbody></table></div>;
}
