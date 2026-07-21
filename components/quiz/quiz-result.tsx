"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, RotateCcw, Target, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBadge } from "@/components/score-badge";
import type { TestResult } from "@/types";

export function QuizResult({ result, onRestart }: { result: TestResult; onRestart: () => void }) {
  const grouped = result.answers.reduce<Record<string, { correct: number; total: number }>>((acc, answer) => {
    acc[answer.topic] ??= { correct: 0, total: 0 };
    acc[answer.topic].total += 1;
    acc[answer.topic].correct += answer.correct ? 1 : 0;
    return acc;
  }, {});
  const sorted = Object.entries(grouped).sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total));
  return <div className="space-y-5"><Card><CardContent className="grid gap-5 p-6 text-center sm:grid-cols-3 sm:text-left"><div><p className="text-sm text-muted-foreground">Нәтиже</p><p className="mt-2 text-4xl font-black">{result.score}/{result.total}</p><ScoreBadge score={result.score} total={result.total} className="mt-3" /></div><div className="flex items-center justify-center gap-3 rounded-xl bg-muted p-4"><Target className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Пайыз</p><p className="text-2xl font-bold">{result.percentage}%</p></div></div><div className="flex items-center justify-center gap-3 rounded-xl bg-muted p-4"><Clock3 className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Уақыт</p><p className="text-2xl font-bold">{Math.floor(result.durationSeconds / 60)}:{String(result.durationSeconds % 60).padStart(2, "0")}</p></div></div></CardContent></Card><Card><CardHeader><CardTitle>Тақырыптар талдауы</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Ең мықты тақырып</p><p className="mt-1 font-semibold text-emerald-700 dark:text-emerald-300">{sorted[0]?.[0] ?? "Дерек жоқ"}</p></div><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Қайталау қажет</p><p className="mt-1 font-semibold text-amber-700 dark:text-amber-300">{sorted.at(-1)?.[0] ?? "Дерек жоқ"}</p></div></CardContent></Card><Card><CardHeader><CardTitle>Әр сұрақ бойынша талдау</CardTitle></CardHeader><CardContent className="space-y-3">{result.answers.map((answer, index) => <details key={`${answer.questionId}-${index}`} className="rounded-xl border p-4"><summary className="flex cursor-pointer list-none items-start gap-3"><span className="mt-0.5">{answer.correct ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-red-600" />}</span><span><strong>{index + 1}. {answer.question}</strong><span className="mt-1 block text-xs text-muted-foreground">{answer.topic}</span></span></summary><div className="mt-4 space-y-2 border-t pt-4 text-sm"><p><span className="text-muted-foreground">Сіздің жауабыңыз:</span> {answer.selectedAnswer || "Жауап берілмеді"}</p><p><span className="text-muted-foreground">Дұрыс жауап:</span> <strong className="text-emerald-700 dark:text-emerald-300">{answer.correctAnswer}</strong></p><p className="rounded-lg bg-muted p-3">{answer.explanationKz}</p></div></details>)}</CardContent></Card><div className="grid gap-3 sm:grid-cols-3"><Button size="lg" onClick={onRestart}><RotateCcw className="mr-2 h-5 w-5" />Қайта бастау</Button><Button size="lg" variant="secondary" asChild><Link href="/mistakes">Қате сұрақтарды шешу</Link></Button><Button size="lg" variant="outline" asChild><Link href="/progress">Прогресті көру</Link></Button></div></div>;
}
