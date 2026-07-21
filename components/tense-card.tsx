"use client";

import Link from "next/link";
import { AlertTriangle, BookCheck, CalendarPlus, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/use-app-store";
import type { Tense } from "@/types";

export function FormulaBlock({ label, formula }: { label: string; formula: string }) {
  return <div><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><div className="formula">{formula}</div></div>;
}

export function TenseCard({ tense, expandedDefault = false }: { tense: Tense; expandedDefault?: boolean }) {
  const [expanded, setExpanded] = useState(expandedDefault);
  const override = useAppStore((state) => state.tenseOverrides[tense.id]);
  const merged = { ...tense, ...override };
  const markTheoryRead = useAppStore((state) => state.markTheoryRead);
  const addTenseReview = useAppStore((state) => state.addTenseReview);
  const status = useAppStore((state) => state.progress[tense.id]?.status ?? "Жаңа");
  return <Card id={tense.id} className="overflow-hidden"><CardHeader className="cursor-pointer" onClick={() => setExpanded((value) => !value)}><div className="flex items-start justify-between gap-3"><div><CardTitle>{merged.name}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{merged.nameKz}</p></div><Badge className="bg-primary/10 text-primary">{status}</Badge></div><p className="pt-2 text-sm leading-6 text-muted-foreground">{merged.usageKz}</p></CardHeader>{expanded && <CardContent className="space-y-5 border-t pt-5"><div className="grid gap-3"><FormulaBlock label="Positive" formula={merged.positiveFormula} /><FormulaBlock label="Negative" formula={merged.negativeFormula} /><FormulaBlock label="Question" formula={merged.questionFormula} /></div><div><p className="mb-2 text-sm font-semibold">Signal words</p><div className="flex flex-wrap gap-2">{merged.signals.map((signal) => <Badge key={signal} className="bg-secondary text-secondary-foreground">{signal}</Badge>)}</div></div><div className="grid gap-3 md:grid-cols-3"><ExampleSentence label="Positive example" value={merged.positiveExample} /><ExampleSentence label="Negative example" value={merged.negativeExample} /><ExampleSentence label="Question example" value={merged.questionExample} /></div><div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40"><div className="flex gap-2 font-semibold text-amber-800 dark:text-amber-300"><AlertTriangle className="h-5 w-5" />Жиі қате</div><p className="mt-2 font-mono text-red-700 line-through dark:text-red-300">{merged.commonError}</p><p className="mt-1 font-mono text-emerald-700 dark:text-emerald-300">{merged.correction}</p></div><div className="grid gap-2 sm:grid-cols-3"><Button variant="success" aria-label={`${merged.name} формуласын жаттадым`} onClick={() => markTheoryRead(tense.id)}><BookCheck className="mr-2 h-4 w-4" />Формуланы жаттадым</Button><Button asChild variant="outline"><Link href={`/quiz?topic=${encodeURIComponent(tense.name)}&count=10`}><PlayCircle className="mr-2 h-4 w-4" />Тест бастау</Link></Button><Button variant="secondary" aria-label={`${merged.name} қайталауға қосу`} onClick={() => addTenseReview(tense.id)}><CalendarPlus className="mr-2 h-4 w-4" />Қайталауға қосу</Button></div></CardContent>}</Card>;
}

export function ExampleSentence({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border bg-muted/40 p-3"><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-2 text-sm font-medium">{value}</p></div>;
}
