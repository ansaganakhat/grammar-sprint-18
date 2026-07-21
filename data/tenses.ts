import type { Tense } from "@/types";

export const tenses: Tense[] = [
  {
    id: "present-simple", group: "Present", family: "Simple", name: "Present Simple", nameKz: "Ауыспалы осы шақ",
    usageKz: "Күнделікті әдет, қайталанатын әрекет, жалпы факт және тұрақты жағдай үшін қолданылады.",
    usageEn: "habits, routines, general facts and permanent situations",
    positiveFormula: "S + V1 / V-s", negativeFormula: "S + do/does not + V1", questionFormula: "Do/Does + S + V1?",
    signals: ["always", "usually", "often", "sometimes", "never", "every day"],
    positiveExample: "She studies English every day.", negativeExample: "She does not study on Sundays.", questionExample: "Does she study English every day?",
    commonError: "Does she studies English?", correction: "Does she study English?"
  },
  {
    id: "present-continuous", group: "Present", family: "Continuous", name: "Present Continuous", nameKz: "Нақ осы шақ",
    usageKz: "Дәл қазір немесе осы уақыт аралығында болып жатқан әрекет үшін қолданылады.",
    usageEn: "actions happening now or around the present moment",
    positiveFormula: "S + am/is/are + V-ing", negativeFormula: "S + am/is/are not + V-ing", questionFormula: "Am/Is/Are + S + V-ing?",
    signals: ["now", "right now", "at the moment", "Look!", "Listen!"],
    positiveExample: "She is studying now.", negativeExample: "She is not studying now.", questionExample: "Is she studying now?",
    commonError: "She studying now.", correction: "She is studying now."
  },
  {
    id: "present-perfect", group: "Present", family: "Perfect", name: "Present Perfect", nameKz: "Аяқталған осы шақ",
    usageKz: "Өткенде болған, бірақ нәтижесі қазіргі уақытпен байланысты әрекет немесе өмірлік тәжірибе үшін қолданылады.",
    usageEn: "past actions connected to the present, results and life experience",
    positiveFormula: "S + have/has + V3", negativeFormula: "S + have/has not + V3", questionFormula: "Have/Has + S + V3?",
    signals: ["already", "yet", "ever", "never", "just", "before", "since", "for"],
    positiveExample: "She has finished her work.", negativeExample: "She has not finished her work yet.", questionExample: "Has she finished her work?",
    commonError: "I have seen her yesterday.", correction: "I saw her yesterday."
  },
  {
    id: "present-perfect-continuous", group: "Present", family: "Perfect Continuous", name: "Present Perfect Continuous", nameKz: "Созылыңқы аяқталған осы шақ",
    usageKz: "Өткенде басталып, қазірге дейін жалғасып жатқан әрекеттің ұзақтығын көрсету үшін қолданылады.",
    usageEn: "actions that started in the past and continue now, with emphasis on duration",
    positiveFormula: "S + have/has been + V-ing", negativeFormula: "S + have/has not been + V-ing", questionFormula: "Have/Has + S + been + V-ing?",
    signals: ["for", "since", "all day", "lately", "recently"],
    positiveExample: "She has been studying for two hours.", negativeExample: "She has not been studying for two hours.", questionExample: "Has she been studying for two hours?",
    commonError: "She has studying for two hours.", correction: "She has been studying for two hours."
  },
  {
    id: "past-simple", group: "Past", family: "Simple", name: "Past Simple", nameKz: "Жедел өткен шақ",
    usageKz: "Өткен уақытта басталып, толық аяқталған әрекет үшін қолданылады.",
    usageEn: "completed actions at a definite time in the past",
    positiveFormula: "S + V2", negativeFormula: "S + did not + V1", questionFormula: "Did + S + V1?",
    signals: ["yesterday", "last week", "last year", "ago", "in 2020"],
    positiveExample: "She studied yesterday.", negativeExample: "She did not study yesterday.", questionExample: "Did she study yesterday?",
    commonError: "Did she studied yesterday?", correction: "Did she study yesterday?"
  },
  {
    id: "past-continuous", group: "Past", family: "Continuous", name: "Past Continuous", nameKz: "Созылыңқы өткен шақ",
    usageKz: "Өткен уақыттың белгілі бір сәтінде жүріп жатқан әрекетті білдіреді.",
    usageEn: "actions in progress at a specific moment in the past",
    positiveFormula: "S + was/were + V-ing", negativeFormula: "S + was/were not + V-ing", questionFormula: "Was/Were + S + V-ing?",
    signals: ["while", "when", "at 8 yesterday", "all evening"],
    positiveExample: "She was studying at 8 p.m.", negativeExample: "She was not studying at 8 p.m.", questionExample: "Was she studying at 8 p.m.?",
    commonError: "She was study at 8 p.m.", correction: "She was studying at 8 p.m."
  },
  {
    id: "past-perfect", group: "Past", family: "Perfect", name: "Past Perfect", nameKz: "Бұрынғы өткен шақ",
    usageKz: "Бір өткен әрекет екінші өткен әрекеттен бұрын болғанын көрсету үшін қолданылады.",
    usageEn: "an action completed before another past action",
    positiveFormula: "S + had + V3", negativeFormula: "S + had not + V3", questionFormula: "Had + S + V3?",
    signals: ["before", "after", "by the time", "already"],
    positiveExample: "She had finished before I arrived.", negativeExample: "She had not finished before I arrived.", questionExample: "Had she finished before you arrived?",
    commonError: "She had finish before I arrived.", correction: "She had finished before I arrived."
  },
  {
    id: "past-perfect-continuous", group: "Past", family: "Perfect Continuous", name: "Past Perfect Continuous", nameKz: "Созылыңқы бұрынғы өткен шақ",
    usageKz: "Өткендегі басқа оқиғаға дейін әрекеттің қанша уақыт жалғасқанын білдіреді.",
    usageEn: "duration of an action continuing before another past event",
    positiveFormula: "S + had been + V-ing", negativeFormula: "S + had not been + V-ing", questionFormula: "Had + S + been + V-ing?",
    signals: ["for", "since", "before", "by the time"],
    positiveExample: "She had been studying for two hours before dinner.", negativeExample: "She had not been studying for long.", questionExample: "Had she been studying before dinner?",
    commonError: "She had been studied for two hours.", correction: "She had been studying for two hours."
  },
  {
    id: "future-simple", group: "Future", family: "Simple", name: "Future Simple", nameKz: "Жай келер шақ",
    usageKz: "Болашақ болжам, уәде, кенет қабылданған шешім немесе болашақ әрекет үшін қолданылады.",
    usageEn: "predictions, promises, spontaneous decisions and future actions",
    positiveFormula: "S + will + V1", negativeFormula: "S + will not + V1", questionFormula: "Will + S + V1?",
    signals: ["tomorrow", "next week", "I think", "probably", "soon"],
    positiveExample: "She will study tomorrow.", negativeExample: "She will not study tomorrow.", questionExample: "Will she study tomorrow?",
    commonError: "She will studies tomorrow.", correction: "She will study tomorrow."
  },
  {
    id: "future-continuous", group: "Future", family: "Continuous", name: "Future Continuous", nameKz: "Созылыңқы келер шақ",
    usageKz: "Болашақ уақыттың белгілі бір сәтінде жүріп жататын әрекет үшін қолданылады.",
    usageEn: "actions that will be in progress at a specific future time",
    positiveFormula: "S + will be + V-ing", negativeFormula: "S + will not be + V-ing", questionFormula: "Will + S + be + V-ing?",
    signals: ["this time tomorrow", "at 8 tomorrow", "all day tomorrow"],
    positiveExample: "She will be studying at 8 p.m. tomorrow.", negativeExample: "She will not be studying at 8 p.m.", questionExample: "Will she be studying at 8 p.m.?",
    commonError: "She will studying tomorrow.", correction: "She will be studying tomorrow."
  },
  {
    id: "future-perfect", group: "Future", family: "Perfect", name: "Future Perfect", nameKz: "Аяқталған келер шақ",
    usageKz: "Болашақтағы белгілі бір уақытқа дейін аяқталатын әрекетті білдіреді.",
    usageEn: "actions that will be completed before a future deadline",
    positiveFormula: "S + will have + V3", negativeFormula: "S + will not have + V3", questionFormula: "Will + S + have + V3?",
    signals: ["by Friday", "by tomorrow", "by 2030", "before"],
    positiveExample: "She will have finished the report by Friday.", negativeExample: "She will not have finished it by Friday.", questionExample: "Will she have finished it by Friday?",
    commonError: "She will have finish the report.", correction: "She will have finished the report."
  },
  {
    id: "future-perfect-continuous", group: "Future", family: "Perfect Continuous", name: "Future Perfect Continuous", nameKz: "Созылыңқы аяқталған келер шақ",
    usageKz: "Болашақтағы белгілі бір уақытқа дейін әрекеттің қанша уақыт жалғасатынын білдіреді.",
    usageEn: "duration of an action continuing up to a future point",
    positiveFormula: "S + will have been + V-ing", negativeFormula: "S + will not have been + V-ing", questionFormula: "Will + S + have been + V-ing?",
    signals: ["for", "by", "by the time", "for two years by"],
    positiveExample: "She will have been studying for two hours by 8 p.m.", negativeExample: "She will not have been studying for two hours.", questionExample: "Will she have been studying for two hours by 8 p.m.?",
    commonError: "She will have been studied for two hours.", correction: "She will have been studying for two hours."
  }
];

export const tenseById = Object.fromEntries(tenses.map((tense) => [tense.id, tense]));
export const tenseByName = Object.fromEntries(tenses.map((tense) => [tense.name, tense]));
