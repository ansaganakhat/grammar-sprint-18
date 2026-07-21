"use client";

import { useMemo, useState } from "react";
import { shuffle } from "@/lib/utils";
import type { Question } from "@/types";

export function useQuiz(source: Question[]) {
  const signature = source.map((item) => item.id).join("|");
  const prepared = useMemo(() => shuffle(source).map((question) => ({ ...question, options: shuffle(question.options) })), [signature]); // eslint-disable-line react-hooks/exhaustive-deps
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});

  const current = prepared[currentIndex];
  const selectAnswer = (answer: string, lock = false) => {
    if (!current || locked[current.id]) return;
    setAnswers((value) => ({ ...value, [current.id]: answer }));
    if (lock) setLocked((value) => ({ ...value, [current.id]: true }));
  };
  const lockCurrent = () => current && setLocked((value) => ({ ...value, [current.id]: true }));
  const next = () => setCurrentIndex((value) => Math.min(value + 1, prepared.length - 1));
  const previous = () => setCurrentIndex((value) => Math.max(0, value - 1));

  return { questions: prepared, current, currentIndex, answers, locked, selectAnswer, lockCurrent, next, previous, setCurrentIndex };
}
