"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { baseQuestionBank } from "@/data/quiz";
import { shuffle } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export default function MockPage() {
  const customQuestions = useAppStore((state) => state.customQuestions);
  const source = useMemo(() => shuffle([...baseQuestionBank, ...customQuestions].filter((item) => item.active)).slice(0, 18), [customQuestions]);
  return <div><PageHeader title="18 сұрақтық магистратура тесті" description="Нақты емтиханға жақын режим: 18 аралас сұрақ, 15 минут, тест кезінде жауап көрсетілмейді. Нәтиже мен толық талдау соңында шығады." /><QuizRunner source={source} mode="18 сұрақтық магистратура форматы" timerSeconds={15 * 60} revealAfterEach={false} /></div>;
}
