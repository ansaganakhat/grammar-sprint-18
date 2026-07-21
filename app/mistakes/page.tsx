"use client";

import { CheckCircle2, Clock3, NotebookPen, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import type { MistakeRecord, Question } from "@/types";

function PracticeBox({ item }: { item: MistakeRecord }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const recordStandaloneAnswer = useAppStore((state) => state.recordStandaloneAnswer);
  const check = () => {
    const correct = answer.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase();
    const question: Question = { id: item.questionId, topic: item.topic, subtopic: "Mistake review", question: item.question, options: [], correctAnswer: item.correctAnswer, explanationKz: item.explanationKz, difficulty: "medium", tags: ["mistake"], active: true };
    recordStandaloneAnswer(question, answer);
    setResult(correct);
  };
  return <div className="mt-4 rounded-xl border bg-background p-4"><p className="mb-2 text-sm font-semibold">Қайта жауап беріңіз</p><div className="flex flex-col gap-2 sm:flex-row"><Input aria-label="Қате сұраққа қайта жауап" value={answer} onChange={(event) => { setAnswer(event.target.value); setResult(null); }} placeholder="Type the correct answer..." /><Button disabled={!answer.trim()} onClick={check}>Тексеру</Button></div>{result !== null && <div className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm ${result ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200" : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200"}`}>{result ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}<span>{result ? "Дұрыс. Қатарынан тағы бір рет дұрыс жауап берсеңіз, сұрақ меңгерілді деп белгіленеді." : `Дұрыс жауап: ${item.correctAnswer}`}</span></div>}</div>;
}

export default function MistakesPage() {
  const mistakes = useAppStore((state) => state.mistakes);
  const [filter, setFilter] = useState("Қайталау қажет");
  const items = useMemo(() => Object.values(mistakes).filter((item) => filter === "Барлығы" || item.status === filter).sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime()), [filter, mistakes]);
  return <div><PageHeader title="Қате дәптері" description="Әр қате жауаптың тарихын көріңіз. Сұрақ қатарынан екі рет дұрыс орындалғаннан кейін ғана «Меңгерілді» статусына өтеді." action={<Select className="w-48" aria-label="Қате дәптері сүзгісі" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Қайталау қажет</option><option>Меңгерілді</option><option>Барлығы</option></Select>} />{items.length ? <div className="space-y-4">{items.map((item) => <Card key={item.questionId}><CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="leading-7">{item.question}</CardTitle><p className="mt-2 text-sm text-muted-foreground">{item.topic}</p></div><Badge className={item.status === "Меңгерілді" ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950" : "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950"}>{item.status}</Badge></div></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Info label="Соңғы жауабыңыз" value={item.userAnswer || "—"} /><Info label="Дұрыс жауап" value={item.correctAnswer} /><Info label="Қате саны" value={String(item.wrongCount)} /><Info label="Қатарынан дұрыс" value={`${item.correctStreak}/2`} /></div><p className="mt-4 rounded-xl bg-muted p-4 text-sm leading-6">{item.explanationKz}</p><div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground"><span>Алғашқы қате: {formatDate(item.firstWrongAt)}</span><span>Соңғы қайталау: {formatDate(item.lastReviewedAt)}</span><span className="flex items-center gap-1"><Clock3 className="h-4 w-4" />Келесі қайталау: {formatDate(item.nextReviewAt)}</span></div>{item.status !== "Меңгерілді" && <PracticeBox item={item} />}</CardContent></Card>)}</div> : <Card><CardContent className="py-16 text-center"><NotebookPen className="mx-auto h-12 w-12 text-muted-foreground" /><h2 className="mt-4 text-lg font-semibold">Бұл бөлім әзірге бос</h2><p className="mt-2 text-sm text-muted-foreground">Тесттегі қате жауаптар автоматты түрде осында сақталады.</p></CardContent></Card>}</div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm font-semibold">{value}</p></div>; }
