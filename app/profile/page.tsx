"use client";

import { Download, RotateCcw, Save } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/use-app-store";

export default function ProfilePage() {
  const profile = useAppStore((state) => state.profile);
  const saveProfile = useAppStore((state) => state.saveProfile);
  const resetProgress = useAppStore((state) => state.resetProgress);
  const state = useAppStore();
  const [name, setName] = useState(profile.name);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal);
  const [targetScore, setTargetScore] = useState(profile.targetScore);
  const [saved, setSaved] = useState(false);
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ profile: state.profile, results: state.results, mistakes: state.mistakes, progress: state.progress, reviewItems: state.reviewItems }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "grammar-sprint-18-progress.json"; anchor.click(); URL.revokeObjectURL(url);
  };
  return <div><PageHeader title="Профиль" description="Күндік оқу мақсатын және емтихан нәтижесінің мақсатын баптаңыз. Деректер осы браузердің localStorage жадында сақталады." /><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Жеке баптаулар</CardTitle></CardHeader><CardContent className="space-y-4"><div><Label htmlFor="name">Атыңыз</Label><Input id="name" className="mt-2" value={name} onChange={(event) => setName(event.target.value)} /></div><div><Label htmlFor="goal">Күндік сұрақ мақсаты</Label><Input id="goal" className="mt-2" type="number" min={5} max={100} value={dailyGoal} onChange={(event) => setDailyGoal(Number(event.target.value))} /></div><div><Label htmlFor="target">18 сұрақ ішіндегі мақсат</Label><Input id="target" className="mt-2" type="number" min={1} max={18} value={targetScore} onChange={(event) => setTargetScore(Number(event.target.value))} /></div><Button className="w-full" size="lg" onClick={() => { saveProfile({ name, dailyGoal, targetScore }); setSaved(true); window.setTimeout(() => setSaved(false), 1800); }}><Save className="mr-2 h-5 w-5" />{saved ? "Сақталды" : "Сақтау"}</Button></CardContent></Card><Card><CardHeader><CardTitle>Деректерді басқару</CardTitle></CardHeader><CardContent className="space-y-4"><div className="rounded-xl bg-muted p-4 text-sm leading-6"><p><strong>Storage key:</strong> <code className="font-mono">grammar-sprint-18:v1</code></p><p className="mt-2 text-muted-foreground">Архитектура ProgressRepository интерфейсі арқылы кейін Supabase сақтау қабатына ауыстыруға дайын.</p></div><Button className="w-full" variant="outline" onClick={exportData}><Download className="mr-2 h-5 w-5" />Прогресті JSON ретінде жүктеу</Button><Button className="w-full" variant="destructive" onClick={() => { if (window.confirm("Барлық прогресс пен қате дәптерін тазалау керек пе?")) resetProgress(); }}><RotateCcw className="mr-2 h-5 w-5" />Прогресті тазалау</Button></CardContent></Card></div></div>;
}
