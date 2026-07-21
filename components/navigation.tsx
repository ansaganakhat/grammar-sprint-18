"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BarChart3, BookOpenCheck, CalendarDays, CircleUserRound, ClipboardCheck, FileSpreadsheet,
  Home, Layers3, Menu, Moon, NotebookPen, PanelLeftClose, Settings2, Sparkles, Sun, Table2, X, Zap
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const navigationItems = [
  { href: "/", label: "Басты бет", icon: Home },
  { href: "/tenses", label: "12 шақ кестесі", icon: Table2 },
  { href: "/formula-cards", label: "Формула карталары", icon: Layers3 },
  { href: "/compare", label: "Шақтарды салыстыру", icon: BookOpenCheck },
  { href: "/recall", label: "Формуланы еске түсіру", icon: Sparkles },
  { href: "/memory-drills", label: "Есте сақтау жаттығулары", icon: Zap },
  { href: "/quiz", label: "Тақырыптық тест", icon: ClipboardCheck },
  { href: "/mock", label: "18 сұрақтық тест", icon: NotebookPen },
  { href: "/mistakes", label: "Қате дәптері", icon: PanelLeftClose },
  { href: "/calendar", label: "Қайталау күнтізбесі", icon: CalendarDays },
  { href: "/progress", label: "Прогресс", icon: BarChart3 },
  { href: "/profile", label: "Профиль", icon: CircleUserRound },
  { href: "/admin", label: "Әкімшілік панель", icon: Settings2 },
  { href: "/import", label: "Excel / CSV импорт", icon: FileSpreadsheet }
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav className="space-y-1" aria-label="Негізгі навигация">{navigationItems.map(({ href, label, icon: Icon }) => {
    const active = pathname === href;
    return <Link key={href} href={href} onClick={onNavigate} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")}><Icon className="h-5 w-5 shrink-0" aria-hidden="true" /><span>{label}</span></Link>;
  })}</nav>;
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return <Button variant="outline" size="icon" aria-label={dark ? "Жарық режимге ауысу" : "Қараңғы режимге ауысу"} onClick={() => setTheme(dark ? "light" : "dark")}>{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>;
}

export function Sidebar() {
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-background/95 p-4 backdrop-blur lg:block"><Link href="/" className="mb-6 flex items-center gap-3 rounded-xl p-2"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground">18</span><span><strong className="block text-lg">Grammar Sprint 18</strong><span className="text-xs text-muted-foreground">13–15/18 мақсаты</span></span></Link><div className="h-[calc(100vh-105px)] overflow-y-auto pr-1"><NavLinks /></div></aside>;
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  return <><header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden"><Button variant="ghost" size="icon" aria-label="Мәзірді ашу" onClick={() => setOpen(true)}><Menu className="h-6 w-6" /></Button><Link href="/" className="font-bold">Grammar Sprint 18</Link><ThemeToggle /></header>{open && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/45" aria-label="Мәзірді жабу" onClick={() => setOpen(false)} /><aside className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-background p-4 shadow-2xl"><div className="mb-5 flex items-center justify-between"><strong className="text-lg">Grammar Sprint 18</strong><Button variant="ghost" size="icon" aria-label="Мәзірді жабу" onClick={() => setOpen(false)}><X className="h-6 w-6" /></Button></div><NavLinks onNavigate={() => setOpen(false)} /></aside></div>}</>;
}

export function DesktopTopbar() {
  return <div className="hidden items-center justify-end py-2 lg:flex"><ThemeToggle /></div>;
}

export function MobileNavigation() {
  const pathname = usePathname();
  const primary = navigationItems.slice(0, 5);
  return <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background/95 px-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur lg:hidden" aria-label="Жылдам навигация">{primary.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[10px]", pathname === href ? "text-primary" : "text-muted-foreground")}><Icon className="h-5 w-5" /><span className="line-clamp-1">{label.split(" ")[0]}</span></Link>)}</nav>;
}
