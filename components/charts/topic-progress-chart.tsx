"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { tenses } from "@/data/tenses";
import type { TenseProgress } from "@/types";

export function TopicProgressChart({ progress }: { progress: Record<string, TenseProgress> }) {
  const data = tenses.map((tense) => ({ name: tense.name.replace(" Continuous", " Cont.").replace("Perfect", "Perf."), value: progress[tense.id]?.bestScore ?? 0 }));
  return <div className="h-[430px] w-full" role="img" aria-label="Шақтар бойынша үздік нәтижелер"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 35, right: 10 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" domain={[0, 100]} /><YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} /><Tooltip formatter={(value) => [`${value}%`, "Үздік нәтиже"]} /><Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 7, 7, 0]} /></BarChart></ResponsiveContainer></div>;
}
