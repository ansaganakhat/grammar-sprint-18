"use client";

import { Award, CheckCircle2, Target, XCircle } from "lucide-react";
import { TopicProgressChart } from "@/components/charts/topic-progress-chart";
import { DashboardCard } from "@/components/dashboard-card";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { tenses } from "@/data/tenses";
import { averagePercent, masteredTopics, totalAnswers } from "@/lib/analytics";
import { useAppStore } from "@/store/use-app-store";

export default function ProgressPage() {
  const progress = useAppStore((state) => state.progress);
  const results = useAppStore((state) => state.results);
  const totals = totalAnswers(results);
  return <div><PageHeader title="Прогресс" description="Әр шақ бойынша теория, formula recall, тест дәлдігі, қате саны және меңгеру статусын бақылаңыз." /><div className="section-grid mb-6"><DashboardCard title="Орташа пайыз" value={`${averagePercent(results)}%`} icon={Target} /><DashboardCard title="Меңгерілді" value={`${masteredTopics(progress)}/12`} icon={Award} /><DashboardCard title="Дұрыс жауап" value={totals.correct} icon={CheckCircle2} /><DashboardCard title="Қате жауап" value={totals.wrong} icon={XCircle} /></div><div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]"><Card><CardHeader><CardTitle>Үздік нәтижелер</CardTitle></CardHeader><CardContent><TopicProgressChart progress={progress} /></CardContent></Card><div className="space-y-3">{tenses.map((tense) => { const item = progress[tense.id]; const recall = item?.formulaAttempts ? Math.round((item.formulaCorrect / item.formulaAttempts) * 100) : 0; const quizTotal = (item?.quizCorrect ?? 0) + (item?.quizWrong ?? 0); const accuracy = quizTotal ? Math.round((item.quizCorrect / quizTotal) * 100) : 0; return <Card key={tense.id}><CardContent className="p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-semibold">{tense.name}</p><p className="text-xs text-muted-foreground">{tense.nameKz}</p></div><Badge className="bg-primary/10 text-primary">{item?.status ?? "Жаңа"}</Badge></div><div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4"><div><p className="text-muted-foreground">Теория</p><p className="mt-1 font-semibold">{item?.theoryRead ? "Оқылды" : "Оқылмады"}</p></div><div><p className="text-muted-foreground">Formula recall</p><p className="mt-1 font-semibold">{recall}%</p></div><div><p className="text-muted-foreground">Quiz accuracy</p><p className="mt-1 font-semibold">{accuracy}%</p></div><div><p className="text-muted-foreground">Үздік нәтиже</p><p className="mt-1 font-semibold">{item?.bestScore ?? 0}%</p></div></div><Progress className="mt-4" value={Math.round((recall + accuracy + (item?.theoryRead ? 100 : 0)) / 3)} label={`${tense.name} жалпы прогресі`} /></CardContent></Card>; })}</div></div></div>;
}
