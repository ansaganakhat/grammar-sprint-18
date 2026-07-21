"use client";

import Link from "next/link";
import { Award, BookOpenCheck, CheckCircle2, Flame, RotateCcw, Target, XCircle } from "lucide-react";
import { WeeklyProgressChart } from "@/components/charts/weekly-progress-chart";
import { DashboardCard } from "@/components/dashboard-card";
import { PageHeader } from "@/components/page-header";
import { ScoreBadge } from "@/components/score-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { averagePercent, dueMistakes, masteredTopics, streakCount, totalAnswers } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export default function DashboardPage() {
  const results = useAppStore((state) => state.results);
  const progress = useAppStore((state) => state.progress);
  const mistakes = useAppStore((state) => state.mistakes);
  const reviewItems = useAppStore((state) => state.reviewItems);
  const activityDates = useAppStore((state) => state.activityDates);
  const profile = useAppStore((state) => state.profile);
  const last = results[0];
  const totals = totalAnswers(results);
  const dueReviews = Object.values(reviewItems).filter((item) => !item.completed && new Date(item.nextReviewAt).getTime() <= Date.now());
  const dueWrong = dueMistakes(mistakes);
  const needsReview = Object.values(progress).filter((item) => item.status === "Қайталау қажет").length;

  return <div><PageHeader title={`Сәлем, ${profile.name}!`} description="Бүгін формулаларды қайталап, 18 сұрақтық тесттегі 13–15 дұрыс жауап мақсатына тағы бір қадам жақындаңыз." /><section className="mb-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]"><Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-blue-600 to-blue-500 text-white"><CardContent className="p-6 sm:p-8"><p className="text-sm font-semibold text-blue-100">Бүгінгі мақсат</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">{profile.dailyGoal} сұрақ + {dueReviews.length + dueWrong.length} қайталау</h2><p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">Алдымен мерзімі келген формулаларды қайталаңыз, кейін 18 сұрақтық аралас тестпен біліміңізді бекітіңіз.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button size="lg" variant="secondary" asChild><Link href="/recall">Сабақты бастау</Link></Button><Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" asChild><Link href="/mock">18 сұрақтық тест</Link></Button></div></CardContent></Card><Card><CardHeader><CardTitle>Соңғы нәтиже</CardTitle></CardHeader><CardContent>{last ? <><div className="flex items-end justify-between"><div><p className="text-4xl font-black">{last.score}/{last.total}</p><p className="mt-1 text-sm text-muted-foreground">{formatDate(last.date)}</p></div><ScoreBadge score={last.score} total={last.total} /></div><p className="mt-5 rounded-xl bg-muted p-3 text-sm">Емтихан мақсаты: <strong>13–15/18</strong></p></> : <div className="py-6 text-center"><p className="font-semibold">Әзірге тест нәтижесі жоқ</p><p className="mt-2 text-sm text-muted-foreground">Алғашқы 18 сұрақтық тестті бастаңыз.</p></div>}</CardContent></Card></section><section className="section-grid mb-6"><DashboardCard title="Орташа нәтиже" value={`${averagePercent(results)}%`} hint="Барлық тесттер" icon={Target} /><DashboardCard title="Дұрыс жауаптар" value={totals.correct} hint="Жалпы саны" icon={CheckCircle2} /><DashboardCard title="Қате жауаптар" value={totals.wrong} hint={`${dueWrong.length} сұрақ қайталауға дайын`} icon={XCircle} /><DashboardCard title="Күндік серия" value={`${streakCount(activityDates)} күн`} hint="Үзіліссіз оқу" icon={Flame} /></section><section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><Card><CardHeader><CardTitle>Апталық прогресс</CardTitle></CardHeader><CardContent><WeeklyProgressChart results={results} /></CardContent></Card><div className="space-y-4"><Card><CardHeader><CardTitle>Оқу жағдайы</CardTitle></CardHeader><CardContent className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40"><Award className="h-5 w-5 text-emerald-600" /><p className="mt-3 text-2xl font-bold">{masteredTopics(progress)}/12</p><p className="text-xs text-muted-foreground">Меңгерілген шақ</p></div><div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40"><RotateCcw className="h-5 w-5 text-amber-600" /><p className="mt-3 text-2xl font-bold">{needsReview}</p><p className="text-xs text-muted-foreground">Қайталау қажет</p></div></CardContent></Card><Card><CardHeader><CardTitle>Бүгін қайталанатын материал</CardTitle></CardHeader><CardContent className="space-y-2">{dueReviews.length + dueWrong.length ? <>{dueReviews.slice(0, 3).map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl border p-3"><BookOpenCheck className="h-5 w-5 text-primary" /><span className="text-sm font-medium">{item.title}</span></div>)}{dueWrong.slice(0, 3).map((item) => <div key={item.questionId} className="rounded-xl border p-3"><p className="line-clamp-2 text-sm font-medium">{item.question}</p><p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{item.topic}</p></div>)}</> : <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">Бүгінге жоспарланған қайталау жоқ. Жаңа тақырып бастаңыз.</p>}<Button className="w-full" variant="outline" asChild><Link href="/calendar">Күнтізбені ашу</Link></Button></CardContent></Card></div></section></div>;
}
