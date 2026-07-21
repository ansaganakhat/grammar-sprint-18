import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("kk-KZ", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export function dateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function addDaysIso(days: number, from = new Date()): string {
  const value = new Date(from);
  value.setDate(value.getDate() + days);
  return value.toISOString();
}
