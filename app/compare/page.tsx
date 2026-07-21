"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { FormulaBlock } from "@/components/tense-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { tenses } from "@/data/tenses";
import { useAppStore } from "@/store/use-app-store";

export default function ComparePage() {
  const overrides = useAppStore((state) => state.tenseOverrides);
  const [leftId, setLeftId] = useState("present-simple");
  const [rightId, setRightId] = useState("present-continuous");
  const leftBase = tenses.find((item) => item.id === leftId)!;
  const rightBase = tenses.find((item) => item.id === rightId)!;
  const left = { ...leftBase, ...overrides[leftId] };
  const right = { ...rightBase, ...overrides[rightId] };
  return <div><PageHeader title="Шақтарды салыстыру" description="Екі шақты қатар қойып, формуласы, қолданылуы, signal words және мысалдары бойынша айырмашылығын көріңіз." /><div className="mb-5 grid gap-3 sm:grid-cols-2"><Select aria-label="Бірінші шақ" value={leftId} onChange={(event) => setLeftId(event.target.value)}>{tenses.map((tense) => <option key={tense.id} value={tense.id}>{tense.name}</option>)}</Select><Select aria-label="Екінші шақ" value={rightId} onChange={(event) => setRightId(event.target.value)}>{tenses.map((tense) => <option key={tense.id} value={tense.id}>{tense.name}</option>)}</Select></div><div className="grid gap-5 lg:grid-cols-2">{[left, right].map((tense) => <Card key={tense.id}><CardHeader><CardTitle>{tense.name}</CardTitle><p className="text-sm text-muted-foreground">{tense.nameKz}</p></CardHeader><CardContent className="space-y-5"><p className="text-sm leading-6">{tense.usageKz}</p><FormulaBlock label="Positive" formula={tense.positiveFormula} /><FormulaBlock label="Negative" formula={tense.negativeFormula} /><FormulaBlock label="Question" formula={tense.questionFormula} /><div><p className="mb-2 text-sm font-semibold">Signal words</p><div className="flex flex-wrap gap-2">{tense.signals.map((signal) => <Badge key={signal} className="bg-secondary text-secondary-foreground">{signal}</Badge>)}</div></div><div className="rounded-xl bg-muted p-4"><p className="text-xs font-semibold text-muted-foreground">Example</p><p className="mt-2 font-medium">{tense.positiveExample}</p></div></CardContent></Card>)}</div></div>;
}
