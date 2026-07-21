"use client";

import { Clock3 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { QuizOption } from "@/components/quiz/quiz-option";
import { QuizResult } from "@/components/quiz/quiz-result";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/hooks/use-quiz";
import { useAppStore } from "@/store/use-app-store";
import type { Question, TestResult } from "@/types";

export function QuizRunner({ source, mode, timerSeconds = 0, revealAfterEach = true, onExit }: { source: Question[]; mode: string; timerSeconds?: number; revealAfterEach?: boolean; onExit?: () => void }) {
  const { questions, current, currentIndex, answers, locked, selectAnswer, lockCurrent, next, previous } = useQuiz(source);
  const recordTest = useAppStore((state) => state.recordTest);
  const [remaining, setRemaining] = useState(timerSeconds);
  const [result, setResult] = useState<TestResult | null>(null);
  const startedAt = useRef(Date.now());

  const finish = useCallback(() => {
    if (result || !questions.length) return;
    const mapped = questions.map((question) => {
      const selectedAnswer = answers[question.id] ?? "";
      return { questionId: question.id, topic: question.topic, question: question.question, selectedAnswer, correctAnswer: question.correctAnswer, explanationKz: question.explanationKz, correct: selectedAnswer === question.correctAnswer };
    });
    const score = mapped.filter((answer) => answer.correct).length;
    const value: TestResult = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `result-${Date.now()}`,
      date: new Date().toISOString(), mode, score, total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      durationSeconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)), answers: mapped
    };
    recordTest(value);
    setResult(value);
  }, [answers, mode, questions, recordTest, result]);

  useEffect(() => {
    if (!timerSeconds || result) return;
    const interval = window.setInterval(() => setRemaining((value) => {
      if (value <= 1) { window.clearInterval(interval); queueMicrotask(finish); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(interval);
  }, [finish, result, timerSeconds]);

  if (!questions.length) return <Card><CardContent className="p-8 text-center"><p className="font-semibold">Бұл режимге сұрақ табылмады.</p><p className="mt-2 text-sm text-muted-foreground">Admin немесе Excel импорт арқылы белсенді сұрақ қосыңыз.</p></CardContent></Card>;
  if (result) return <QuizResult result={result} onRestart={() => window.location.reload()} />;
  if (!current) return null;
  const selected = answers[current.id];
  const isLocked = Boolean(locked[current.id]);
  const last = currentIndex === questions.length - 1;
  const progressValue = ((currentIndex + 1) / questions.length) * 100;

  const choose = (option: string) => selectAnswer(option, revealAfterEach);
  return <div className="mx-auto max-w-3xl space-y-4"><div className="flex items-center justify-between gap-3"><div className="flex-1"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>{currentIndex + 1}/{questions.length}</span><span>{current.topic}</span></div><Progress value={progressValue} label={`Тест прогресі: ${currentIndex + 1} / ${questions.length}`} /></div>{timerSeconds > 0 && <div className="flex min-w-24 items-center justify-center gap-2 rounded-xl border bg-card px-3 py-2 font-mono font-bold"><Clock3 className="h-4 w-4" /><span>{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</span></div>}</div><Card><CardHeader><p className="text-xs font-semibold uppercase tracking-wide text-primary">{current.subtopic} · {current.difficulty}</p><h2 className="text-xl font-bold leading-8 sm:text-2xl">{current.question}</h2></CardHeader><CardContent className="space-y-3">{current.options.map((option, index) => <QuizOption key={option} label={String.fromCharCode(65 + index)} value={option} selected={selected === option} locked={isLocked} correctAnswer={current.correctAnswer} onSelect={() => choose(option)} />)}{revealAfterEach && isLocked && <div className={`rounded-xl border p-4 text-sm ${selected === current.correctAnswer ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40" : "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40"}`}><p className="font-semibold">{selected === current.correctAnswer ? "Дұрыс жауап!" : `Дұрыс жауап: ${current.correctAnswer}`}</p><p className="mt-2 leading-6">{current.explanationKz}</p></div>}</CardContent></Card><div className="flex flex-wrap justify-between gap-3"><div className="flex gap-2"><Button variant="outline" disabled={currentIndex === 0} onClick={previous}>Артқа</Button>{onExit && <Button variant="ghost" onClick={onExit}>Тесттен шығу</Button>}</div><div className="flex gap-2">{!revealAfterEach && selected && !isLocked && <Button variant="secondary" onClick={lockCurrent}>Жауапты бекіту</Button>}<Button disabled={!selected || (revealAfterEach && !isLocked)} onClick={() => last ? finish() : next()}>{last ? "Нәтижені көру" : "Келесі сұрақ"}</Button></div></div></div>;
}
