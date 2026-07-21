"use client";

import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { tenses } from "@/data/tenses";
import { useAppStore } from "@/store/use-app-store";
import type { Question } from "@/types";

const taskTypes = ["Positive формула", "Negative формула", "Question формула", "Signal word бойынша шақ", "Жетіспейтін бөлікті толықтыру", "Қате формуланы түзету"];

function normalize(value: string) {
  return value.toLowerCase().replace(/[?.!,]/g, "").replace(/doesn't/g, "does not").replace(/don't/g, "do not").replace(/won't/g, "will not").replace(/\s+/g, " ").trim();
}

function tolerantMatch(input: string, expected: string) {
  const a = normalize(input);
  const b = normalize(expected);
  if (a === b) return true;
  const expectedTokens = new Set(b.split(/[ +/]+/).filter(Boolean));
  const inputTokens = new Set(a.split(/[ +/]+/).filter(Boolean));
  const matched = Array.from(expectedTokens).filter((token) => inputTokens.has(token)).length;
  return matched / Math.max(expectedTokens.size, 1) >= 0.8;
}

export default function RecallPage() {
  const [tenseId, setTenseId] = useState("present-perfect");
  const [taskType, setTaskType] = useState(taskTypes[0]);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const overrides = useAppStore((state) => state.tenseOverrides);
  const baseTense = tenses.find((item) => item.id === tenseId)!;
  const tense = { ...baseTense, ...overrides[tenseId] };
  const recordFormulaAttempt = useAppStore((state) => state.recordFormulaAttempt);
  const recordStandaloneAnswer = useAppStore((state) => state.recordStandaloneAnswer);

  const task = useMemo(() => {
    if (taskType === "Positive формула") return { prompt: `Write the positive formula of ${tense.name}.`, expected: tense.positiveFormula, hint: tense.usageKz };
    if (taskType === "Negative формула") return { prompt: `Write the negative formula of ${tense.name}.`, expected: tense.negativeFormula, hint: tense.usageKz };
    if (taskType === "Question формула") return { prompt: `Write the question formula of ${tense.name}.`, expected: tense.questionFormula, hint: tense.usageKz };
    if (taskType === "Signal word бойынша шақ") return { prompt: `Which tense is commonly indicated by “${tense.signals[0]}”?`, expected: tense.name, hint: `Signal words: ${tense.signals.join(", ")}` };
    if (taskType === "Жетіспейтін бөлікті толықтыру") return { prompt: `Complete the formula: ${tense.positiveFormula.replace(/(have\/has|had|will|am\/is\/are|was\/were|V1|V2|V3)/, "___")}`, expected: tense.positiveFormula, hint: `Толық формуланы жазыңыз.` };
    return { prompt: `Correct the error: “${tense.commonError}”`, expected: tense.correction, hint: `Негізгі етістік пен көмекші етістікке назар аударыңыз.` };
  }, [taskType, tense]);

  const check = () => {
    const correct = tolerantMatch(answer, task.expected);
    setChecked(correct);
    recordFormulaAttempt(tense.id, correct);
    if (!correct) {
      const question: Question = { id: `recall-${tense.id}-${taskType}`, topic: tense.name, subtopic: "Formula Recall", question: task.prompt, options: [], correctAnswer: task.expected, explanationKz: `${tense.name}: ${task.expected}. ${tense.usageKz}`, difficulty: "medium", tags: ["recall"], active: true, source: "custom" };
      recordStandaloneAnswer(question, answer);
    }
  };
  const reset = () => { setAnswer(""); setChecked(null); };

  return <div><PageHeader title="Формуланы еске түсіру" description="Формула жасырылған кезде өзіңіз жазып көріңіз. Жүйе дәл сәйкестікті ғана емес, негізгі грамматикалық элементтердің болуын да тексереді." /><div className="mb-5 grid gap-3 sm:grid-cols-2"><Select aria-label="Шақты таңдау" value={tenseId} onChange={(event) => { setTenseId(event.target.value); reset(); }}>{tenses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select><Select aria-label="Жаттығу түрін таңдау" value={taskType} onChange={(event) => { setTaskType(event.target.value); reset(); }}>{taskTypes.map((type) => <option key={type}>{type}</option>)}</Select></div><Card className="mx-auto max-w-3xl"><CardHeader><p className="text-sm font-semibold text-primary">{tense.name} · {taskType}</p><CardTitle className="leading-8">{task.prompt}</CardTitle></CardHeader><CardContent className="space-y-4"><p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">Көмек: {task.hint}</p><Input className="h-14 font-mono text-base" aria-label="Формула жауабы" placeholder="Type your answer..." value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && answer) check(); }} disabled={checked !== null} />{checked !== null && <div className={`rounded-xl border p-4 ${checked ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" : "border-red-400 bg-red-50 dark:bg-red-950/40"}`}><div className="flex items-center gap-2 font-semibold">{checked ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-red-600" />}{checked ? "Дұрыс!" : "Қайта қарау қажет"}</div><p className="mt-3 text-sm">Дұрыс жауап:</p><div className="formula mt-2">{task.expected}</div>{!checked && <p className="mt-3 text-sm leading-6">{tense.usageKz}</p>}</div>}<div className="flex gap-3">{checked === null ? <Button size="lg" className="flex-1" disabled={!answer.trim()} onClick={check}>Тексеру</Button> : <Button size="lg" className="flex-1" onClick={reset}><RefreshCw className="mr-2 h-5 w-5" />Келесі әрекет</Button>}</div></CardContent></Card></div>;
}
