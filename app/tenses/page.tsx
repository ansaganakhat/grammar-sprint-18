import { PageHeader } from "@/components/page-header";
import { TenseMatrix } from "@/components/tense-matrix";
import { Card, CardContent } from "@/components/ui/card";
export default function TensesPage() { return <div><PageHeader title="12 шақ кестесі" description="4 шақ отбасы мен 3 уақытты бір матрицада салыстырыңыз. Карточканы басқанда толық формула бетіне өтесіз." /><TenseMatrix /><Card className="mt-5"><CardContent className="p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Есте сақтау логикасы:</strong> алдымен уақытты таңдаңыз — Present, Past немесе Future. Кейін әрекеттің сипатын анықтаңыз — Simple, Continuous, Perfect немесе Perfect Continuous.</CardContent></Card></div>; }
