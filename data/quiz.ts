import { tenses } from "@/data/tenses";
import type { Difficulty, Question, Tense } from "@/types";

function uniqueOptions(correct: string, candidates: string[]): string[] {
  const fallback = tenses.flatMap((item) => [
    item.name, item.positiveFormula, item.negativeFormula, item.questionFormula,
    item.positiveExample, item.commonError, item.correction, item.usageEn, ...item.signals
  ]);
  const values = [correct, ...candidates, ...fallback].filter((value) => value && value !== correct);
  return [correct, ...Array.from(new Set(values))].slice(0, 4);
}

function otherValues<T extends keyof Tense>(tense: Tense, key: T): string[] {
  return tenses.filter((item) => item.id !== tense.id).map((item) => String(item[key]));
}

function q(
  id: string,
  tense: Tense,
  question: string,
  options: string[],
  correctAnswer: string,
  explanationKz: string,
  difficulty: Difficulty,
  tags: string[]
): Question {
  return {
    id,
    topic: tense.name,
    subtopic: tags[0] ?? tense.family,
    question,
    options: uniqueOptions(correctAnswer, options),
    correctAnswer,
    explanationKz,
    difficulty,
    tags,
    active: true,
    source: "generated"
  };
}

function buildTenseQuestions(tense: Tense, index: number): Question[] {
  const next = (offset: number) => tenses[(index + offset) % tenses.length];
  const signal = tense.signals[0];
  const wrongSignal = [next(1).signals[0], next(3).signals[0], next(5).signals[0]];
  return [
    q(
      `generated-${tense.id}-positive`, tense,
      `Choose the positive formula of ${tense.name}.`,
      [next(1).positiveFormula, next(2).positiveFormula, next(4).positiveFormula],
      tense.positiveFormula,
      `${tense.name} positive формуласы: ${tense.positiveFormula}.`,
      "easy", ["formula", "positive"]
    ),
    q(
      `generated-${tense.id}-negative`, tense,
      `Choose the negative formula of ${tense.name}.`,
      [next(1).negativeFormula, next(2).negativeFormula, next(5).negativeFormula],
      tense.negativeFormula,
      `${tense.name} negative формуласы: ${tense.negativeFormula}.`,
      "easy", ["formula", "negative"]
    ),
    q(
      `generated-${tense.id}-question`, tense,
      `Choose the question formula of ${tense.name}.`,
      [next(1).questionFormula, next(2).questionFormula, next(6).questionFormula],
      tense.questionFormula,
      `${tense.name} question формуласы: ${tense.questionFormula}.`,
      "easy", ["formula", "question"]
    ),
    q(
      `generated-${tense.id}-identify`, tense,
      `Which tense is used in this sentence? “${tense.positiveExample}”`,
      [next(1).name, next(2).name, next(4).name],
      tense.name,
      `Сөйлемдегі көмекші етістік пен етістік формасы ${tense.name} құрылымына сәйкес келеді.`,
      "medium", ["identify", "example"]
    ),
    q(
      `generated-${tense.id}-signal`, tense,
      `Which signal word is most closely connected with ${tense.name}?`,
      wrongSignal,
      signal,
      `“${signal}” — ${tense.name} үшін жиі қолданылатын signal word.`,
      "easy", ["signal words"]
    ),
    q(
      `generated-${tense.id}-correct`, tense,
      `Choose the correct sentence.`,
      [tense.commonError, next(1).commonError, next(2).commonError],
      tense.correction,
      `Дұрыс нұсқа: ${tense.correction} Қате нұсқада негізгі етістік формасы дұрыс қолданылмаған.`,
      "medium", ["error correction"]
    ),
    q(
      `generated-${tense.id}-usage`, tense,
      `Which use best describes ${tense.name}?`,
      [next(1).usageEn, next(2).usageEn, next(4).usageEn],
      tense.usageEn,
      `${tense.name}: ${tense.usageKz}`,
      "medium", ["usage"]
    ),
    q(
      `generated-${tense.id}-example`, tense,
      `Choose the correct example of ${tense.name}.`,
      [next(1).positiveExample, next(2).positiveExample, next(3).positiveExample],
      tense.positiveExample,
      `Дұрыс мысал ${tense.positiveFormula} формуласына сай құрылған.`,
      "medium", ["example"]
    ),
    q(
      `generated-${tense.id}-auxiliary`, tense,
      `Which formula element is essential in ${tense.name}?`,
      [next(1).positiveFormula, next(2).negativeFormula, next(5).questionFormula],
      tense.positiveFormula,
      `Негізгі құрылым: ${tense.positiveFormula}.`,
      "hard", ["structure"]
    ),
    q(
      `generated-${tense.id}-contrast`, tense,
      `Select the tense that matches this formula: ${tense.positiveFormula}`,
      [next(1).name, next(4).name, next(8).name],
      tense.name,
      `${tense.positiveFormula} — ${tense.name} формуласы.`,
      "medium", ["formula match"]
    )
  ];
}

export const seedQuiz: Question[] = [
  { id: "seed-1", topic: "Present Simple", subtopic: "Affirmative", question: "She usually ___ English in the evening.", options: ["study", "studies", "is studying", "studied"], correctAnswer: "studies", explanationKz: "Usually — Present Simple белгісі. She болғандықтан етістікке -s жалғанады.", difficulty: "easy", tags: ["present", "simple"], active: true, source: "seed" },
  { id: "seed-2", topic: "Present Continuous", subtopic: "Affirmative", question: "Look! The children ___ in the garden.", options: ["play", "played", "are playing", "have played"], correctAnswer: "are playing", explanationKz: "Look! — дәл қазір болып жатқан әрекет. Формула: are + V-ing.", difficulty: "easy", tags: ["present", "continuous"], active: true, source: "seed" },
  { id: "seed-3", topic: "Present Perfect", subtopic: "Affirmative", question: "I ___ this book already.", options: ["read", "have read", "am reading", "had read"], correctAnswer: "have read", explanationKz: "Already көбіне Present Perfect-пен қолданылады: have + V3.", difficulty: "medium", tags: ["present", "perfect"], active: true, source: "seed" },
  { id: "seed-4", topic: "Present Perfect Continuous", subtopic: "Duration", question: "She ___ for two hours.", options: ["studies", "has studied", "has been studying", "was studying"], correctAnswer: "has been studying", explanationKz: "For two hours және әрекет әлі жалғасып тұр: have/has been + V-ing.", difficulty: "medium", tags: ["present", "perfect continuous"], active: true, source: "seed" },
  { id: "seed-5", topic: "Past Simple", subtopic: "Irregular verb", question: "We ___ him yesterday.", options: ["see", "have seen", "saw", "had seen"], correctAnswer: "saw", explanationKz: "Yesterday — Past Simple белгісі. See етістігінің V2 формасы — saw.", difficulty: "easy", tags: ["past", "simple"], active: true, source: "seed" },
  { id: "seed-6", topic: "Past Continuous", subtopic: "Process", question: "At 9 p.m. last night, I ___.", options: ["studied", "was studying", "have studied", "had studied"], correctAnswer: "was studying", explanationKz: "Өткен уақыттың нақты сәтіндегі процесс: was/were + V-ing.", difficulty: "easy", tags: ["past", "continuous"], active: true, source: "seed" },
  { id: "seed-7", topic: "Past Perfect", subtopic: "Earlier past", question: "By the time we arrived, the train ___.", options: ["left", "has left", "had left", "was leaving"], correctAnswer: "had left", explanationKz: "Пойыз біз келгенге дейін кетіп қалған. Ертерек өткен әрекет — Past Perfect.", difficulty: "medium", tags: ["past", "perfect"], active: true, source: "seed" },
  { id: "seed-8", topic: "Past Perfect Continuous", subtopic: "Duration", question: "He was tired because he ___ all day.", options: ["worked", "had worked", "had been working", "was worked"], correctAnswer: "had been working", explanationKz: "Өткен сәтке дейін әрекеттің ұзақтығы көрсетілген: had been + V-ing.", difficulty: "hard", tags: ["past", "perfect continuous"], active: true, source: "seed" },
  { id: "seed-9", topic: "Future Simple", subtopic: "Prediction", question: "I think it ___ tomorrow.", options: ["rains", "is raining", "will rain", "will be raining"], correctAnswer: "will rain", explanationKz: "I think — болашақ болжам. Формула: will + V1.", difficulty: "easy", tags: ["future", "simple"], active: true, source: "seed" },
  { id: "seed-10", topic: "Future Continuous", subtopic: "Future process", question: "This time tomorrow, we ___ to Astana.", options: ["fly", "will fly", "will be flying", "will have flown"], correctAnswer: "will be flying", explanationKz: "Болашақтың белгілі бір сәтіндегі процесс: will be + V-ing.", difficulty: "medium", tags: ["future", "continuous"], active: true, source: "seed" },
  { id: "seed-11", topic: "Future Perfect", subtopic: "Deadline", question: "By Friday, she ___ the report.", options: ["will finish", "will be finishing", "will have finished", "finishes"], correctAnswer: "will have finished", explanationKz: "By Friday — болашақ мерзімге дейін аяқталатын әрекет.", difficulty: "medium", tags: ["future", "perfect"], active: true, source: "seed" },
  { id: "seed-12", topic: "Future Perfect Continuous", subtopic: "Duration", question: "By next month, he ___ here for ten years.", options: ["will work", "will be working", "will have worked", "will have been working"], correctAnswer: "will have been working", explanationKz: "Болашақтағы уақытқа дейінгі ұзақтық: will have been + V-ing.", difficulty: "hard", tags: ["future", "perfect continuous"], active: true, source: "seed" },
  { id: "seed-13", topic: "Past Simple", subtopic: "Question", question: "Did she ___ to the lesson yesterday?", options: ["came", "come", "comes", "coming"], correctAnswer: "come", explanationKz: "Did көмекші етістігінен кейін негізгі етістік V1 формасында тұрады.", difficulty: "easy", tags: ["past", "question"], active: true, source: "seed" },
  { id: "seed-14", topic: "Present Perfect", subtopic: "Question", question: "Has he ___ the task yet?", options: ["finish", "finished", "finishing", "finishes"], correctAnswer: "finished", explanationKz: "Present Perfect: has + V3.", difficulty: "easy", tags: ["present", "question"], active: true, source: "seed" },
  { id: "seed-15", topic: "Past Continuous", subtopic: "Contrast", question: "While I ___ dinner, the phone rang.", options: ["cooked", "was cooking", "have cooked", "had cooked"], correctAnswer: "was cooking", explanationKz: "Ұзақ процесс Past Continuous, қысқа әрекет Past Simple арқылы беріледі.", difficulty: "medium", tags: ["past", "contrast"], active: true, source: "seed" },
  { id: "seed-16", topic: "Present Perfect", subtopic: "Since/for", question: "I have known her ___ 2020.", options: ["for", "since", "during", "from"], correctAnswer: "since", explanationKz: "Since + басталу нүктесі: since 2020.", difficulty: "easy", tags: ["present", "signal"], active: true, source: "seed" },
  { id: "seed-17", topic: "Tense Contrast", subtopic: "Present contrast", question: "She usually ___ to work, but today she ___ a taxi.", options: ["walks / is taking", "is walking / takes", "walked / has taken", "walks / takes"], correctAnswer: "walks / is taking", explanationKz: "Usually — Present Simple, today уақытша жағдай болғандықтан Present Continuous.", difficulty: "hard", tags: ["contrast", "present"], active: true, source: "seed" },
  { id: "seed-18", topic: "Tense Contrast", subtopic: "Past contrast", question: "When I arrived, they ___.", options: ["ate", "were eating", "have eaten", "had been eaten"], correctAnswer: "were eating", explanationKz: "Мен келген сәтте әрекет жүріп жатқан: Past Continuous.", difficulty: "medium", tags: ["contrast", "past"], active: true, source: "seed" }
];

export const generatedQuiz: Question[] = tenses.flatMap(buildTenseQuestions);
export const baseQuestionBank: Question[] = [...seedQuiz, ...generatedQuiz];

export const quizModes = [
  "Бір шақ бойынша 10 сұрақ",
  "Бір шақ бойынша 20 сұрақ",
  "Present Tenses",
  "Past Tenses",
  "Future Tenses",
  "Simple vs Continuous",
  "Simple vs Perfect",
  "Perfect vs Perfect Continuous",
  "12 шақ аралас",
  "18 сұрақтық магистратура форматы"
];
