"use client";

import { Download, Edit3, FileSpreadsheet, Plus, Power, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { AdminQuestionForm } from "@/components/admin-question-form";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { baseQuestionBank } from "@/data/quiz";
import { tenses } from "@/data/tenses";
import { useAppStore } from "@/store/use-app-store";
import type { Question, Tense } from "@/types";

function FormulaEditor() {
  const overrides = useAppStore((state) => state.tenseOverrides);
  const updateTense = useAppStore((state) => state.updateTense);
  const [tenseId, setTenseId] = useState(tenses[0].id);
  const base = tenses.find((item) => item.id === tenseId)!;
  const merged = { ...base, ...overrides[tenseId] };
  const [form, setForm] = useState<Tense>(merged);
  const choose = (id: string) => { const item = tenses.find((tense) => tense.id === id)!; setTenseId(id); setForm({ ...item, ...overrides[id] }); };
  return <Card><CardHeader><CardTitle>Тақырып пен формулаларды өңдеу</CardTitle></CardHeader><CardContent className="space-y-4"><Select aria-label="Өңделетін шақ" value={tenseId} onChange={(event) => choose(event.target.value)}>{tenses.map((tense) => <option key={tense.id} value={tense.id}>{tense.name}</option>)}</Select><div className="grid gap-4 sm:grid-cols-2"><div><Label>English name</Label><Input className="mt-2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div><div><Label>Қазақша атауы</Label><Input className="mt-2" value={form.nameKz} onChange={(event) => setForm({ ...form, nameKz: event.target.value })} /></div></div><div><Label>Қазақша түсіндірме</Label><Textarea className="mt-2" value={form.usageKz} onChange={(event) => setForm({ ...form, usageKz: event.target.value })} /></div><div className="grid gap-4"><div><Label>Positive formula</Label><Input className="mt-2 font-mono" value={form.positiveFormula} onChange={(event) => setForm({ ...form, positiveFormula: event.target.value })} /></div><div><Label>Negative formula</Label><Input className="mt-2 font-mono" value={form.negativeFormula} onChange={(event) => setForm({ ...form, negativeFormula: event.target.value })} /></div><div><Label>Question formula</Label><Input className="mt-2 font-mono" value={form.questionFormula} onChange={(event) => setForm({ ...form, questionFormula: event.target.value })} /></div></div><div><Label>Signal words</Label><Input className="mt-2" value={form.signals.join(", ")} onChange={(event) => setForm({ ...form, signals: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></div><div className="grid gap-4 sm:grid-cols-2"><div><Label>Common error</Label><Input className="mt-2" value={form.commonError} onChange={(event) => setForm({ ...form, commonError: event.target.value })} /></div><div><Label>Correction</Label><Input className="mt-2" value={form.correction} onChange={(event) => setForm({ ...form, correction: event.target.value })} /></div></div><Button className="w-full" onClick={() => updateTense(tenseId, form)}>Формула өзгерістерін сақтау</Button><p className="text-xs text-muted-foreground">Өзгерістер localStorage-да сақталып, формула карточкаларында бірден көрінеді.</p></CardContent></Card>;
}

export default function AdminPage() {
  const customQuestions = useAppStore((state) => state.customQuestions);
  const addQuestion = useAppStore((state) => state.addQuestion);
  const updateQuestion = useAppStore((state) => state.updateQuestion);
  const deleteQuestion = useAppStore((state) => state.deleteQuestion);
  const [editing, setEditing] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("Барлығы");
  const [search, setSearch] = useState("");
  const topics = Array.from(new Set([...baseQuestionBank, ...customQuestions].map((item) => item.topic))).sort();
  const visible = useMemo(() => customQuestions.filter((item) => (filter === "Барлығы" || item.topic === filter) && `${item.question} ${item.topic}`.toLowerCase().includes(search.toLowerCase())), [customQuestions, filter, search]);
  const all = [...baseQuestionBank, ...customQuestions];

  const exportQuestions = (format: "xlsx" | "csv") => {
    const rows = all.map((item) => ({ ID: item.id, Topic: item.topic, Subtopic: item.subtopic, Question: item.question, "Option A": item.options[0], "Option B": item.options[1], "Option C": item.options[2], "Option D": item.options[3], "Correct Answer": item.correctAnswer, "Explanation KZ": item.explanationKz, Difficulty: item.difficulty, Tags: item.tags.join(", "), Active: item.active }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    if (format === "csv") {
      const blob = new Blob([XLSX.utils.sheet_to_csv(sheet)], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "grammar-sprint-18-questions.csv"; a.click(); URL.revokeObjectURL(url); return;
    }
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, sheet, "Questions"); XLSX.writeFile(workbook, "grammar-sprint-18-questions.xlsx");
  };
  const save = (question: Question) => { if (customQuestions.some((item) => item.id === question.id)) updateQuestion(question); else addQuestion(question); setEditing(null); setShowForm(false); };

  return <div><PageHeader title="Әкімшілік панель" description="Формулаларды өңдеңіз, жаңа сұрақ қосыңыз, қиындық пен белсенділік статусын басқарыңыз және сұрақтарды Excel/CSV ретінде экспорттаңыз." action={<Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="mr-2 h-4 w-4" />Жаңа сұрақ</Button>} /><div className="mb-6 grid gap-4 sm:grid-cols-3"><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Базалық сұрақтар</p><p className="mt-2 text-3xl font-bold">{baseQuestionBank.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Custom / Import</p><p className="mt-2 text-3xl font-bold">{customQuestions.length}</p></CardContent></Card><Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Белсенді сұрақтар</p><p className="mt-2 text-3xl font-bold">{all.filter((item) => item.active).length}</p></CardContent></Card></div>{showForm && <Card className="mb-6"><CardHeader><CardTitle>{editing ? "Сұрақты өңдеу" : "Жаңа сұрақ қосу"}</CardTitle></CardHeader><CardContent><AdminQuestionForm initial={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null); }} /></CardContent></Card>}<div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><Card><CardHeader><div className="flex flex-wrap items-center justify-between gap-3"><CardTitle>Custom сұрақтар</CardTitle><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => exportQuestions("xlsx")}><FileSpreadsheet className="mr-2 h-4 w-4" />Excel</Button><Button size="sm" variant="outline" onClick={() => exportQuestions("csv")}><Download className="mr-2 h-4 w-4" />CSV</Button></div></div></CardHeader><CardContent><div className="mb-4 grid gap-3 sm:grid-cols-2"><Input placeholder="Сұрақтан іздеу..." aria-label="Сұрақтан іздеу" value={search} onChange={(event) => setSearch(event.target.value)} /><Select aria-label="Тақырып сүзгісі" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Барлығы</option>{topics.map((topic) => <option key={topic}>{topic}</option>)}</Select></div>{visible.length ? <div className="space-y-3">{visible.map((question) => <div key={question.id} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2"><Badge className="bg-primary/10 text-primary">{question.topic}</Badge><Badge>{question.difficulty}</Badge>{!question.active && <Badge className="bg-slate-200 text-slate-700">Белсенді емес</Badge>}</div><p className="mt-3 font-semibold leading-6">{question.question}</p><p className="mt-2 text-xs text-muted-foreground">Дұрыс жауап: {question.correctAnswer}</p></div><div className="flex shrink-0 gap-1"><Button size="icon" variant="ghost" aria-label="Сұрақты өңдеу" onClick={() => { setEditing(question); setShowForm(true); }}><Edit3 className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Сұрақтың белсенділігін өзгерту" onClick={() => updateQuestion({ ...question, active: !question.active })}><Power className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Сұрақты жою" onClick={() => deleteQuestion(question.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></div></div></div>)}</div> : <div className="rounded-xl bg-muted p-8 text-center text-sm text-muted-foreground">Custom сұрақ жоқ. Жаңа сұрақ қосыңыз немесе Excel импорт қолданыңыз.</div>}</CardContent></Card><FormulaEditor /></div></div>;
}
