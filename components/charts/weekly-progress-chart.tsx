"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TestResult } from "@/types";

export function WeeklyProgressChart({ results }: { results: TestResult[] }) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const dayResults = results.filter((result) => result.date.slice(0, 10) === key);
    return {
      day: new Intl.DateTimeFormat("kk-KZ", { weekday: "short" }).format(date),
      percent: dayResults.length ? Math.round(dayResults.reduce((sum, item) => sum + item.percentage, 0) / dayResults.length) : 0
    };
  });
  return <div className="h-64 w-full" role="img" aria-label="Соңғы жеті күндегі тест нәтижелерінің диаграммасы"><ResponsiveContainer width="100%" height="100%"><BarChart data={days} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} tickLine={false} axisLine={false} /><Tooltip formatter={(value) => [`${value}%`, "Нәтиже"]} /><Bar dataKey="percent" fill="hsl(var(--primary))" radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
