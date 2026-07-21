"use client";

import { Brain, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { tenses } from "@/data/tenses";
import { useAppStore } from "@/store/use-app-store";
import type { Question } from "@/types";

const types = [
  "Формуланы толықтыру", "Шақты анықтау", "Signal word бойынша шақ", "Қатені табу",
  "Үш форманы құрау", "Бір етістікті 12 шақта қолдану", "Сөйлемді қайта жазу", "Формула мен шақты сәйкестендіру"
];

const normalize = (value: string) => value.toLowerCase().replace(/[?.!,]/g, "").replace(/\s+/g, " ").trim();

export default function MemoryDrillsPage() {
  const [type, setType] = useState(types[0]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const recordStandaloneAnswer = useAppStore((state) => state.recordStandaloneAnswer);
  const overrides = useAppStore((state) => state.tenseOverrides);
  const baseTense = tenses[index % tenses.length];
  const tense = { ...baseTense, ...overrides[baseTense.id] };

  const drill = useMemo(() => {
    if (type === "Формуланы толықтыру") return { prompt: `${tense.name}: ${tense.positiveFormula.replace(/(have\/has|had|will|am\/is\/are|was\/were|V1|V2|V3)/, "___")}`, expected: tense.positiveFormula, explanation: `Толық формула: ${tense.positiveFormula}` };
    if (type === "Шақты анықтау") return { prompt: `Identify the tense: “${tense.positiveExample}”`, expected: tense.name, explanation: `${tense.positiveExample} — ${tense.name}.` };
    if (type === "Signal word бойынша шақ") return { prompt: `Choose the tense for the signal word: “${tense.signals[0]}”`, expected: tense.name, explanation: `${tense.signals[0]} — ${tense.name} шақпен жиі қолданылады.` };
    if (type === "Қатені табу") return { prompt: `Correct the sentence: “${tense.commonError}”`, expected: tense.correction, explanation: `Дұрыс нұсқа: ${tense.correction}` };
    if (type === "Үш форманы құрау") return { prompt: `Write Positive | Negative | Question formulas for ${tense.name}.`, expected: `${tense.positiveFormula} | ${tense.negativeFormula} | ${tense.questionFormula}`, explanation: `Positive: ${tense.positiveFormula}; Negative: ${tense.negativeFormula}; Question: ${tense.questionFormula}.` };
    if (type === "Бір етістікті 12 шақта қолдану") return { prompt: `Use the verb “study” in ${tense.name} (positive, subject: she).`, expected: tense.positiveExample, explanation: `Мысал: ${tense.positiveExample}` };
    if (type === "Сөйлемді қайта жазу") return { prompt: `Rewrite “She studies every day.” in ${tense.name}.`, expected: tense.positiveExample, explanation: `Мүмкін жауап: ${tense.positiveExample}` };
    return { prompt: `Match the formula to a tense: ${tense.positiveFormula}`, expected: tense.name, explanation: `${tense.positiveFormula} — ${tense.name}.` };
  }, [tense, type]);

  const check = () => {
    const input = normalize(answer);
    const expected = normalize(drill.expected);
    const expectedWords = expected.split(/[| +/]+/).filter(Boolean);
    const matched = expectedWords.filter((word) => input.includes(word)).length;
    const correct = input === expected || matched / Math.max(expectedWords.length, 1) >= 0.75;
    setChecked(correct);
    if (!correct) {
      const question: Question = { id: `memory-${type}-${tense.id}`, topic: tense.name, subtopic: type, question: drill.prompt, options: [], correctAnswer: drill.expected, explanationKz: drill.explanation, difficulty: "medium", tags: ["memory drill"], active: true, source: "custom" };
      recordStandaloneAnswer(question, answer);
    }
  };
  const next = () => { setIndex((value) => value + 1); setAnswer(""); setChecked(null); };

  return <div><PageHeader title="Есте сақтау жаттығулары" description="Формуланы тану ғана емес, оны өзіңіз құрау, қатені түзету және сөйлемді басқа шаққа ауыстыру арқылы ұзақ мерзімді есте сақтауды күшейтіңіз." /><div className="grid gap-5 lg:grid-cols-[300px_1fr]"><Card><CardHeader><CardTitle>Жаттығу түрі</CardTitle></CardHeader><CardContent><Select aria-label="Жаттығу түрі" value={type} onChange={(event) => { setType(event.target.value); setAnswer(""); setChecked(null); }}>{types.map((item) => <option key={item}>{item}</option>)}</Select><div className="mt-5 rounded-xl bg-primary/10 p-4"><Brain className="h-7 w-7 text-primary" /><p className="mt-3 text-sm leading-6">Бір жаттығуды кемінде 5 шақпен қайталаңыз. Қате жауаптар автоматты түрде қате дәптеріне түседі.</p></div></CardContent></Card><Card><CardHeader><p className="text-sm font-semibold text-primary">{type}</p><CardTitle className="leading-8">{drill.prompt}</CardTitle></CardHeader><CardContent className="space-y-4"><Input className="h-14 font-mono" placeholder="Type your answer..." aria-label="Жаттығу жауабы" value={answer} disabled={checked !== null} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && answer) check(); }} />{checked !== null && <div className={`rounded-xl border p-4 ${checked ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" : "border-red-400 bg-red-50 dark:bg-red-950/40"}`}><div className="flex items-center gap-2 font-semibold">{checked ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-red-600" />}{checked ? "Дұрыс жауап" : "Қате жауап"}</div><p className="mt-3 text-sm leading-6">{drill.explanation}</p><div className="formula mt-3">{drill.expected}</div></div>}{checked === null ? <Button size="lg" className="w-full" disabled={!answer.trim()} onClick={check}>Тексеру</Button> : <Button size="lg" className="w-full" onClick={next}><RefreshCw className="mr-2 h-5 w-5" />Келесі жаттығу</Button>}</CardContent></Card></div></div>;
}
