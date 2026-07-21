"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { tenses } from "@/data/tenses";
import type { Difficulty, Question } from "@/types";

const emptyQuestion = (): Question => ({
  id: `custom-${Date.now()}`,
  topic: tenses[0].name,
  subtopic: "Grammar",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanationKz: "",
  difficulty: "medium",
  tags: [],
  active: true,
  source: "custom"
});

export function AdminQuestionForm({ initial, onSave, onCancel }: { initial?: Question | null; onSave: (question: Question) => void; onCancel?: () => void }) {
  const [form, setForm] = useState<Question>(initial ?? emptyQuestion());
  useEffect(() => { setForm(initial ?? emptyQuestion()); }, [initial]);
  const setOption = (index: number, value: string) => setForm((item) => ({ ...item, options: item.options.map((option, optionIndex) => optionIndex === index ? value : option) }));
  const valid = form.id.trim() && form.topic.trim() && form.question.trim() && form.options.every((item) => item.trim()) && form.options.includes(form.correctAnswer) && form.explanationKz.trim();
  return <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); if (valid) onSave({ ...form, tags: form.tags.filter(Boolean), source: "custom" }); }}><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="qid">ID</Label><Input id="qid" className="mt-2" value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} /></div><div><Label htmlFor="topic">Topic</Label><Input id="topic" list="topic-list" className="mt-2" value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} /><datalist id="topic-list">{tenses.map((tense) => <option key={tense.id} value={tense.name} />)}</datalist></div></div><div><Label htmlFor="subtopic">Subtopic</Label><Input id="subtopic" className="mt-2" value={form.subtopic} onChange={(event) => setForm({ ...form, subtopic: event.target.value })} /></div><div><Label htmlFor="question">Question</Label><Textarea id="question" className="mt-2" value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} /></div><div className="grid gap-3 sm:grid-cols-2">{form.options.map((option, index) => <div key={index}><Label htmlFor={`option-${index}`}>Option {String.fromCharCode(65 + index)}</Label><Input id={`option-${index}`} className="mt-2" value={option} onChange={(event) => setOption(index, event.target.value)} /></div>)}</div><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="correct">Correct Answer</Label><Select id="correct" className="mt-2" value={form.correctAnswer} onChange={(event) => setForm({ ...form, correctAnswer: event.target.value })}><option value="">Select answer</option>{form.options.filter(Boolean).map((option, index) => <option key={`${option}-${index}`} value={option}>{String.fromCharCode(65 + form.options.indexOf(option))}: {option}</option>)}</Select></div><div><Label htmlFor="difficulty">Difficulty</Label><Select id="difficulty" className="mt-2" value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value as Difficulty })}><option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option></Select></div></div><div><Label htmlFor="explanation">Explanation KZ</Label><Textarea id="explanation" className="mt-2" value={form.explanationKz} onChange={(event) => setForm({ ...form, explanationKz: event.target.value })} /></div><div><Label htmlFor="tags">Tags</Label><Input id="tags" className="mt-2" placeholder="present, formula, signal" value={form.tags.join(", ")} onChange={(event) => setForm({ ...form, tags: event.target.value.split(",").map((tag) => tag.trim()) })} /></div><label className="flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} className="h-5 w-5 accent-blue-600" /><span className="text-sm font-medium">Сұрақ белсенді</span></label><div className="flex gap-3"><Button type="submit" className="flex-1" disabled={!valid}>{initial ? "Өзгерісті сақтау" : "Сұрақ қосу"}</Button>{onCancel && <Button type="button" variant="outline" onClick={onCancel}>Бас тарту</Button>}</div></form>;
}
