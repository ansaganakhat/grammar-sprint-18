"use client";

import { PlayCircle, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { baseQuestionBank, quizModes } from "@/data/quiz";
import { tenses } from "@/data/tenses";
import { shuffle } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import type { Question } from "@/types";

function expand(pool: Question[], count: number): Question[] {
  if (!pool.length) return [];
  const shuffled = shuffle(pool);
  if (shuffled.length >= count) return shuffled.slice(0, count);
  return Array.from({ length: count }, (_, index) => {
    const item = shuffled[index % shuffled.length];
    return index < shuffled.length ? item : { ...item, id: `${item.id}-variant-${index}`, question: item.question };
  });
}

export default function QuizPage() {
  const customQuestions = useAppStore((state) => state.customQuestions);
  const allQuestions = useMemo(() => [...baseQuestionBank, ...customQuestions].filter((item) => item.active), [customQuestions]);
  const [mode, setMode] = useState(quizModes[0]);
  const [topic, setTopic] = useState(tenses[0].name);
  const [count, setCount] = useState(10);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [source, setSource] = useState<Question[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialTopic = params.get("topic");
    const initialCount = Number(params.get("count"));
    if (initialTopic && tenses.some((item) => item.name === initialTopic)) setTopic(initialTopic);
    if (initialCount === 20) { setCount(20); setMode(quizModes[1]); }
  }, []);

  const buildPool = () => {
    if (mode.startsWith("Бір шақ")) return allQuestions.filter((item) => item.topic === topic);
    if (mode === "Present Tenses") return allQuestions.filter((item) => item.topic.startsWith("Present") || item.tags.includes("present"));
    if (mode === "Past Tenses") return allQuestions.filter((item) => item.topic.startsWith("Past") || item.tags.includes("past"));
    if (mode === "Future Tenses") return allQuestions.filter((item) => item.topic.startsWith("Future") || item.tags.includes("future"));
    if (mode === "Simple vs Continuous") return allQuestions.filter((item) => item.topic.includes("Simple") || item.topic.includes("Continuous"));
    if (mode === "Simple vs Perfect") return allQuestions.filter((item) => item.topic.includes("Simple") || (item.topic.includes("Perfect") && !item.topic.includes("Continuous")));
    if (mode === "Perfect vs Perfect Continuous") return allQuestions.filter((item) => item.topic.includes("Perfect"));
    return allQuestions;
  };

  const start = () => {
    const requestedCount = mode === "18 сұрақтық магистратура форматы" ? 18 : mode.includes("20") ? 20 : count;
    setSource(expand(buildPool(), requestedCount));
    setStarted(true);
  };

  if (started) return <div><PageHeader title={mode} description="Жауапты таңдағаннан кейін түсіндірмені оқып, келесі сұраққа өтіңіз." /><QuizRunner source={source} mode={mode} timerSeconds={timerEnabled ? source.length * 30 : 0} revealAfterEach onExit={() => setStarted(false)} /></div>;

  return <div><PageHeader title="Тақырыптық тест" description="Quizizz форматына ұқсас режимде тақырыпты, сұрақ санын және таймерді таңдаңыз. Әр жауаптан кейін қазақша түсіндірме беріледі." /><div className="grid gap-5 lg:grid-cols-[1fr_360px]"><Card><CardHeader><CardTitle>Тест параметрлері</CardTitle></CardHeader><CardContent className="space-y-5"><div><label className="mb-2 block text-sm font-medium">Тест түрі</label><Select value={mode} aria-label="Тест түрі" onChange={(event) => { const value = event.target.value; setMode(value); if (value.includes("20")) setCount(20); if (value.includes("10")) setCount(10); }}>{quizModes.map((item) => <option key={item}>{item}</option>)}</Select></div>{mode.startsWith("Бір шақ") && <div><label className="mb-2 block text-sm font-medium">Шақ</label><Select value={topic} aria-label="Шақты таңдау" onChange={(event) => setTopic(event.target.value)}>{tenses.map((item) => <option key={item.id}>{item.name}</option>)}</Select></div>}{!mode.includes("18 сұрақтық") && !mode.includes("10") && !mode.includes("20") && <div><label className="mb-2 block text-sm font-medium">Сұрақ саны</label><Select value={count} aria-label="Сұрақ саны" onChange={(event) => setCount(Number(event.target.value))}><option value={10}>10 сұрақ</option><option value={20}>20 сұрақ</option><option value={30}>30 сұрақ</option></Select></div>}<label className="flex cursor-pointer items-center justify-between rounded-xl border p-4"><span><strong className="block text-sm">Таймер</strong><span className="text-xs text-muted-foreground">Әр сұраққа шамамен 30 секунд</span></span><input type="checkbox" checked={timerEnabled} onChange={(event) => setTimerEnabled(event.target.checked)} className="h-5 w-5 accent-blue-600" aria-label="Таймерді қосу немесе өшіру" /></label><Button size="lg" className="w-full" onClick={start}><PlayCircle className="mr-2 h-5 w-5" />Тестті бастау</Button></CardContent></Card><Card className="h-fit"><CardHeader><CardTitle>Тест ережесі</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-muted-foreground"><p>• Әр сұрақта 4 жауап нұсқасы және бір дұрыс жауап бар.</p><p>• Жауаптан кейін қазақша түсіндірме көрсетіледі.</p><p>• Қате жауап автоматты түрде қате дәптеріне қосылады.</p><p>• Жауаптар мен сұрақтардың реті әр тестте араласады.</p><div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-primary"><Timer className="h-5 w-5" /><strong>Мақсат: кемінде 80%</strong></div></CardContent></Card></div></div>;
}
