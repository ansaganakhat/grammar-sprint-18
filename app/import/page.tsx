import { ExcelImport } from "@/components/excel-import";
import { PageHeader } from "@/components/page-header";
export default function ImportPage() { return <div><PageHeader title="Excel / CSV импорт" description="Файлды жүктегеннен кейін жүйе барлық жолды тексеріп, дұрыс сұрақтарды preview ретінде көрсетеді. Қате жолдар импортқа дейін бөлек белгіленеді." /><ExcelImport /></div>; }
