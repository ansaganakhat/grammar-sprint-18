"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { tenses, tenseByName } from "@/data/tenses";
import { addDaysIso, dateKey } from "@/lib/utils";
import { nextReviewDate } from "@/services/spaced-repetition";
import type { MistakeRecord, Profile, Question, ReviewItem, Tense, TenseProgress, TestResult, TopicStatus } from "@/types";

interface AppState {
  version: number;
  profile: Profile;
  customQuestions: Question[];
  tenseOverrides: Record<string, Partial<Tense>>;
  results: TestResult[];
  mistakes: Record<string, MistakeRecord>;
  progress: Record<string, TenseProgress>;
  reviewItems: Record<string, ReviewItem>;
  activityDates: string[];
  saveProfile: (profile: Profile) => void;
  markTheoryRead: (tenseId: string) => void;
  recordFormulaAttempt: (tenseId: string, correct: boolean) => void;
  addTenseReview: (tenseId: string) => void;
  recordTest: (result: TestResult) => void;
  recordStandaloneAnswer: (question: Question, selectedAnswer: string) => void;
  addQuestion: (question: Question) => void;
  updateTense: (tenseId: string, patch: Partial<Tense>) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;
  importQuestions: (questions: Question[], replace: boolean) => void;
  resetProgress: () => void;
}

function initialProgress(): Record<string, TenseProgress> {
  return Object.fromEntries(
    tenses.map((tense) => [
      tense.id,
      {
        tenseId: tense.id,
        theoryRead: false,
        formulaAttempts: 0,
        formulaCorrect: 0,
        quizCorrect: 0,
        quizWrong: 0,
        lastScore: 0,
        bestScore: 0,
        reviewCount: 0,
        recentScores: [],
        status: "Жаңа" as TopicStatus
      }
    ])
  );
}

function deriveStatus(item: TenseProgress, hasOpenMistake: boolean): TopicStatus {
  const recall = item.formulaAttempts ? (item.formulaCorrect / item.formulaAttempts) * 100 : 0;
  const lastTwo = item.recentScores.slice(-2);
  if (lastTwo.length === 2 && lastTwo.every((value) => value >= 80) && recall >= 80 && !hasOpenMistake) return "Меңгерілді";
  if (hasOpenMistake || item.quizWrong > item.quizCorrect) return "Қайталау қажет";
  if (item.quizCorrect + item.quizWrong === 0 && !item.theoryRead) return "Жаңа";
  if (item.bestScore >= 80 || recall >= 70) return "Жақсы";
  return "Оқылып жатыр";
}

function addActivity(activityDates: string[]): string[] {
  const key = dateKey();
  return activityDates.includes(key) ? activityDates : [...activityDates, key].slice(-90);
}

function updateMistake(
  mistakes: Record<string, MistakeRecord>,
  question: Question,
  selectedAnswer: string,
  correct: boolean
): Record<string, MistakeRecord> {
  const current = mistakes[question.id];
  const now = new Date().toISOString();
  if (!correct) {
    const review = nextReviewDate(current?.intervalIndex ?? 0, false);
    return {
      ...mistakes,
      [question.id]: {
        questionId: question.id,
        topic: question.topic,
        question: question.question,
        userAnswer: selectedAnswer,
        correctAnswer: question.correctAnswer,
        explanationKz: question.explanationKz,
        firstWrongAt: current?.firstWrongAt ?? now,
        lastReviewedAt: now,
        wrongCount: (current?.wrongCount ?? 0) + 1,
        correctStreak: 0,
        intervalIndex: review.intervalIndex,
        nextReviewAt: review.nextReviewAt,
        status: "Қайталау қажет"
      }
    };
  }
  if (!current) return mistakes;
  const streak = current.correctStreak + 1;
  const mastered = streak >= 2;
  const review = nextReviewDate(current.intervalIndex, true);
  return {
    ...mistakes,
    [question.id]: {
      ...current,
      userAnswer: selectedAnswer,
      lastReviewedAt: now,
      correctStreak: streak,
      intervalIndex: review.intervalIndex,
      nextReviewAt: review.nextReviewAt,
      status: mastered ? "Меңгерілді" : "Қайталау қажет"
    }
  };
}

function updateProgressForTest(
  progress: Record<string, TenseProgress>,
  mistakes: Record<string, MistakeRecord>,
  result: TestResult
): Record<string, TenseProgress> {
  const next = structuredClone(progress);
  const grouped: Record<string, { correct: number; total: number }> = {};
  result.answers.forEach((answer) => {
    const tense = tenseByName[answer.topic];
    if (!tense) return;
    const item = next[tense.id] ?? initialProgress()[tense.id];
    item.quizCorrect += answer.correct ? 1 : 0;
    item.quizWrong += answer.correct ? 0 : 1;
    grouped[tense.id] ??= { correct: 0, total: 0 };
    grouped[tense.id].correct += answer.correct ? 1 : 0;
    grouped[tense.id].total += 1;
  });
  Object.entries(grouped).forEach(([tenseId, stats]) => {
    const score = Math.round((stats.correct / stats.total) * 100);
    const item = next[tenseId];
    item.lastScore = score;
    item.bestScore = Math.max(item.bestScore, score);
    item.recentScores = [...item.recentScores, score].slice(-5);
    const hasOpenMistake = Object.values(mistakes).some((mistake) => mistake.topic === tenses.find((tense) => tense.id === tenseId)?.name && mistake.status !== "Меңгерілді");
    item.status = deriveStatus(item, hasOpenMistake);
  });
  return next;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      version: 1,
      profile: { name: "Аңсаған", dailyGoal: 20, targetScore: 15 },
      customQuestions: [],
      tenseOverrides: {},
      results: [],
      mistakes: {},
      progress: initialProgress(),
      reviewItems: {},
      activityDates: [],
      saveProfile: (profile) => set({ profile }),
      markTheoryRead: (tenseId) => set((state) => {
        const item = { ...(state.progress[tenseId] ?? initialProgress()[tenseId]), theoryRead: true };
        item.status = deriveStatus(item, false);
        return { progress: { ...state.progress, [tenseId]: item }, activityDates: addActivity(state.activityDates) };
      }),
      recordFormulaAttempt: (tenseId, correct) => set((state) => {
        const item = { ...(state.progress[tenseId] ?? initialProgress()[tenseId]) };
        item.formulaAttempts += 1;
        item.formulaCorrect += correct ? 1 : 0;
        item.status = deriveStatus(item, false);
        const reviewId = `review-${tenseId}`;
        const currentReview = state.reviewItems[reviewId];
        let reviewItems = state.reviewItems;
        if (currentReview) {
          const nextReview = nextReviewDate(currentReview.intervalIndex, correct);
          reviewItems = { ...state.reviewItems, [reviewId]: { ...currentReview, intervalIndex: nextReview.intervalIndex, nextReviewAt: nextReview.nextReviewAt, completed: correct && nextReview.intervalIndex >= 5 } };
        }
        return { progress: { ...state.progress, [tenseId]: item }, reviewItems, activityDates: addActivity(state.activityDates) };
      }),
      addTenseReview: (tenseId) => set((state) => {
        const tense = tenses.find((item) => item.id === tenseId);
        if (!tense) return state;
        const id = `review-${tenseId}`;
        const item: ReviewItem = { id, tenseId, title: `${tense.name} формулалары`, intervalIndex: 1, nextReviewAt: addDaysIso(1), completed: false };
        const progressItem = { ...state.progress[tenseId], reviewCount: (state.progress[tenseId]?.reviewCount ?? 0) + 1 };
        return { reviewItems: { ...state.reviewItems, [id]: item }, progress: { ...state.progress, [tenseId]: progressItem } };
      }),
      recordTest: (result) => set((state) => {
        let mistakes = state.mistakes;
        result.answers.forEach((answer) => {
          const question: Question = {
            id: answer.questionId,
            topic: answer.topic,
            subtopic: "Test",
            question: answer.question,
            options: [],
            correctAnswer: answer.correctAnswer,
            explanationKz: answer.explanationKz,
            difficulty: "medium",
            tags: [],
            active: true
          };
          mistakes = updateMistake(mistakes, question, answer.selectedAnswer, answer.correct);
        });
        return {
          results: [result, ...state.results].slice(0, 100),
          mistakes,
          progress: updateProgressForTest(state.progress, mistakes, result),
          activityDates: addActivity(state.activityDates)
        };
      }),
      recordStandaloneAnswer: (question, selectedAnswer) => set((state) => ({
        mistakes: updateMistake(state.mistakes, question, selectedAnswer, selectedAnswer === question.correctAnswer),
        activityDates: addActivity(state.activityDates)
      })),
      addQuestion: (question) => set((state) => ({ customQuestions: [...state.customQuestions, question] })),
      updateTense: (tenseId, patch) => set((state) => ({ tenseOverrides: { ...state.tenseOverrides, [tenseId]: { ...state.tenseOverrides[tenseId], ...patch } } })),
      updateQuestion: (question) => set((state) => ({ customQuestions: state.customQuestions.map((item) => item.id === question.id ? question : item) })),
      deleteQuestion: (id) => set((state) => ({ customQuestions: state.customQuestions.filter((item) => item.id !== id) })),
      importQuestions: (questions, replace) => set((state) => ({ customQuestions: replace ? questions : [...state.customQuestions.filter((item) => !questions.some((q) => q.id === item.id)), ...questions] })),
      resetProgress: () => set({ results: [], mistakes: {}, progress: initialProgress(), reviewItems: {}, activityDates: [] })
    }),
    {
      name: "grammar-sprint-18:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        profile: state.profile,
        customQuestions: state.customQuestions,
        tenseOverrides: state.tenseOverrides,
        results: state.results,
        mistakes: state.mistakes,
        progress: state.progress,
        reviewItems: state.reviewItems,
        activityDates: state.activityDates
      })
    }
  )
);

export function getAllQuestions(customQuestions: Question[]): Question[] {
  // Ішкі импорт циклін болдырмау үшін динамикалық require қолданбаймыз; компоненттер baseQuestionBank-пен біріктіреді.
  return customQuestions;
}
