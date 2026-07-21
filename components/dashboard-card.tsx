import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export function DashboardCard({ title, value, hint, icon: Icon }: { title: string; value: string | number; hint?: string; icon: LucideIcon }) {
  return <Card><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{title}</p><p className="mt-2 text-2xl font-bold">{value}</p>{hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}</div><span className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span></CardContent></Card>;
}
