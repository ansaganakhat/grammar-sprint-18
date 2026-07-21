"use client";

import Link from "next/link";
import { CalendarCheck2, CircleAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export default function CalendarPage() {
  const reviewItems = useAppStore((state) => state.reviewItems);
  const mistakes = useAppStore((state) => state.mistakes);
  const events = [
    ...Object.values(reviewItems).filter((item) => !item.completed).map((item) => ({ id: item.id, title: item.title, date: item.nextReviewAt, type: "Формула", href: "/recall" })),
    ...Object.values(mistakes).filter((item) => item.status !== "Меңгерілді").map((item) => ({ id: item.questionId, title: item.question, date: item.nextReviewAt, type: "Қате сұрақ", href: "/mistakes" }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const today = new Date().toISOString().slice(0, 10);
  const groups = events.reduce<Record<string, typeof events>>((acc, item) => { const key = item.date.slice(0, 10); (acc[key] ??= []).push(item); return acc; }, {});
  return <div><PageHeader title="Қайталау күнтізбесі" description="0–1–3–7–14–30 күндік spaced repetition кестесі. Қате жауаптан кейін интервал қайтадан 1 күнге түседі." /><div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-6">{[0, 1, 3, 7, 14, 30].map((day, index) => <div key={day} className="rounded-xl border bg-card p-3 text-center"><p className="text-lg font-bold text-primary">{day}</p><p className="text-[11px] text-muted-foreground">{index === 0 ? "Жаңа" : `${index}-қайталау`}</p></div>)}</div>{events.length ? <div className="space-y-5">{Object.entries(groups).map(([date, group]) => <Card key={date} className={date <= today ? "border-amber-400" : ""}><CardHeader><div className="flex items-center justify-between"><CardTitle>{formatDate(date)}</CardTitle>{date < today ? <span className="text-xs font-semibold text-red-600">Мерзімі өтті</span> : date === today ? <span className="text-xs font-semibold text-amber-600">Бүгін</span> : null}</div></CardHeader><CardContent className="space-y-2">{group.map((item) => <div key={item.id} className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"><div className="flex gap-3"><span className="mt-0.5">{item.type === "Формула" ? <CalendarCheck2 className="h-5 w-5 text-primary" /> : <CircleAlert className="h-5 w-5 text-amber-600" />}</span><div><p className="line-clamp-2 text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.type}</p></div></div><Button size="sm" variant="outline" asChild><Link href={item.href}>Қайталау</Link></Button></div>)}</CardContent></Card>)}</div> : <Card><CardContent className="py-16 text-center"><CalendarCheck2 className="mx-auto h-12 w-12 text-emerald-600" /><h2 className="mt-4 text-lg font-semibold">Жоспарланған қайталау жоқ</h2><p className="mt-2 text-sm text-muted-foreground">Формула картасынан тақырыпты қайталауға қосыңыз немесе тест бастаңыз.</p></CardContent></Card>}</div>;
}
