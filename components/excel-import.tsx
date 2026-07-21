"use client";

import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Upload } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/store/use-app-store";
import type { Difficulty, Question } from "@/types";

interface PreviewRow { row: number; question?: Question; errors: string[]; raw: Record<string, unknown> }

const headerAliases: Record<string, string[]> = {
  id: ["ID", "Id", "id"], topic: ["Topic", "Тақырып"], subtopic: ["Subtopic", "Қосымша тақырып"], question: ["Question", "Сұрақ"],
  optionA: ["Option A", "A"], optionB: ["Option B", "B"], optionC: ["Option C", "C"], optionD: ["Option D", "D"],
  correctAnswer: ["Correct Answer", "Дұрыс жауап"], explanationKz: ["Explanation KZ", "Түсіндірме KZ", "Түсіндірме"], difficulty: ["Difficulty", "Қиындық"], tags: ["Tags", "Тегтер"]
};

function readField(row: Record<string, unknown>, field: keyof typeof headerAliases): string {
  const key = headerAliases[field].find((alias) => Object.prototype.hasOwnProperty.call(row, alias));
  return key ? String(row[key] ?? "").trim() : "";
}

function parseRows(rows: Record<string, unknown>[]): PreviewRow[] {
  return rows.map((raw, index) => {
    const id = readField(raw, "id"); const topic = readField(raw, "topic"); const subtopic = readField(raw, "subtopic"); const questionText = readField(raw, "question");
    const options = [readField(raw, "optionA"), readField(raw, "optionB"), readField(raw, "optionC"), readField(raw, "optionD")];
    const correctRaw = readField(raw, "correctAnswer");
    const correctAnswer = /^[ABCD]$/i.test(correctRaw) ? options[correctRaw.toUpperCase().charCodeAt(0) - 65] : correctRaw;
    const explanationKz = readField(raw, "explanationKz");
    const difficultyRaw = readField(raw, "difficulty").toLowerCase() || "medium";
    const tags = readField(raw, "tags").split(/[,;]/).map((tag) => tag.trim()).filter(Boolean);
    const errors: string[] = [];
    if (!id) errors.push("ID бос"); if (!topic) errors.push("Topic бос"); if (!questionText) errors.push("Question бос");
    if (options.some((option) => !option)) errors.push("Option A–D толық емес");
    if (!correctAnswer || !options.includes(correctAnswer)) errors.push("Correct Answer нұсқалардың біріне сәйкес емес");
    if (!explanationKz) errors.push("Explanation KZ бос");
    if (!["easy", "medium", "hard"].includes(difficultyRaw)) errors.push("Difficulty: easy, medium немесе hard болуы керек");
    const question: Question | undefined = errors.length ? undefined : { id, topic, subtopic: subtopic || "Grammar", question: questionText, options, correctAnswer, explanationKz, difficulty: difficultyRaw as Difficulty, tags, active: true, source: "import" };
    return { row: index + 2, question, errors, raw };
  });
}

export function ExcelImport() {
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [replace, setReplace] = useState(false);
  const [message, setMessage] = useState("");
  const importQuestions = useAppStore((state) => state.importQuestions);
  const valid = preview.filter((item) => item.question).map((item) => item.question!);
  const invalid = preview.filter((item) => item.errors.length);

  const readFile = async (file: File) => {
    setMessage(""); setFileName(file.name);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      setPreview(parseRows(rows));
    } catch (error) {
      setPreview([]); setMessage(error instanceof Error ? error.message : "Файлды оқу мүмкін болмады");
    }
  };
  const commit = () => { importQuestions(valid, replace); setMessage(`${valid.length} сұрақ сәтті импортталды.`); };

  return <div className="space-y-5"><Card><CardHeader><CardTitle>1. Шаблонды толтыру</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm leading-6 text-muted-foreground">Excel шаблонында ID, Topic, Subtopic, Question, Option A–D, Correct Answer, Explanation KZ, Difficulty және Tags бағандары бар. Correct Answer ұяшығына жауап мәтінін немесе A/B/C/D әрпін жазыңыз.</p><Button variant="outline" asChild><a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Grammar_Sprint_18_Import_Template.xlsx`} download><Download className="mr-2 h-5 w-5" />Excel шаблонын жүктеу</a></Button></CardContent></Card><Card><CardHeader><CardTitle>2. Файлды жүктеу</CardTitle></CardHeader><CardContent><label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/30 p-6 text-center hover:border-primary"><FileSpreadsheet className="h-12 w-12 text-primary" /><strong className="mt-4">.xlsx, .xls немесе .csv файлын таңдаңыз</strong><span className="mt-2 text-sm text-muted-foreground">Импорт алдында барлық жол preview арқылы тексеріледі</span><input className="sr-only" type="file" accept=".xlsx,.xls,.csv" aria-label="Excel немесе CSV файлын таңдау" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file); }} /></label>{fileName && <p className="mt-3 text-sm"><strong>Файл:</strong> {fileName}</p>}{message && <p className="mt-3 rounded-xl bg-muted p-3 text-sm">{message}</p>}</CardContent></Card>{preview.length > 0 && <Card><CardHeader><div className="flex flex-wrap items-center justify-between gap-3"><CardTitle>3. Preview</CardTitle><div className="flex gap-2 text-sm"><span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Дұрыс: {valid.length}</span><span className="rounded-full bg-red-100 px-3 py-1 text-red-800">Қате: {invalid.length}</span></div></div></CardHeader><CardContent><div className="max-h-[520px] overflow-auto rounded-xl border"><table className="min-w-[900px] w-full text-left text-sm"><thead className="sticky top-0 bg-muted"><tr><th className="p-3">Row</th><th className="p-3">Status</th><th className="p-3">ID</th><th className="p-3">Topic</th><th className="p-3">Question</th><th className="p-3">Details</th></tr></thead><tbody>{preview.map((item) => <tr key={item.row} className="border-t"><td className="p-3">{item.row}</td><td className="p-3">{item.errors.length ? <AlertTriangle className="h-5 w-5 text-red-600" /> : <CheckCircle2 className="h-5 w-5 text-emerald-600" />}</td><td className="p-3">{String(item.raw.ID ?? item.raw.Id ?? "")}</td><td className="p-3">{String(item.raw.Topic ?? "")}</td><td className="max-w-md p-3">{String(item.raw.Question ?? "")}</td><td className="p-3 text-xs text-red-600">{item.errors.join("; ") || "Импортқа дайын"}</td></tr>)}</tbody></table></div><label className="mt-4 flex items-center gap-3 rounded-xl border p-3"><input type="checkbox" checked={replace} onChange={(event) => setReplace(event.target.checked)} className="h-5 w-5 accent-blue-600" /><span className="text-sm">Бұрын импортталған custom сұрақтарды толық ауыстыру</span></label><Button size="lg" className="mt-4 w-full" disabled={!valid.length} onClick={commit}><Upload className="mr-2 h-5 w-5" />{valid.length} сұрақты импорттау</Button></CardContent></Card>}</div>;
}
