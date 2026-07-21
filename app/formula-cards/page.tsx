import { PageHeader } from "@/components/page-header";
import { TenseCard } from "@/components/tense-card";
import { tenses } from "@/data/tenses";
export default function FormulaCardsPage() { return <div><PageHeader title="Формула карталары" description="Әр шақтың Positive, Negative және Question формулаларын, signal words, мысалдар мен жиі қателерді қайталаңыз." /><div className="grid gap-5 xl:grid-cols-2">{tenses.map((tense) => <TenseCard key={tense.id} tense={tense} />)}</div></div>; }
