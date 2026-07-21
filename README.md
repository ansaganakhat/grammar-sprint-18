# Grammar Sprint 18

Қазақстандағы магистратураға түсу емтиханының ағылшын тілі бөліміне дайындалуға арналған mobile-first оқу платформасы.

Негізгі мақсат: 18 сұрақтық лексика-грамматикалық тестте тұрақты түрде **13–15 дұрыс жауап** алу.

## Мүмкіндіктер

- 12 шақтың 4 × 3 интерактивті матрицасы;
- әр шақтың Positive, Negative және Question формулалары;
- signal words, мысалдар және жиі қателер;
- формуланы өзіңіз жазып тексеретін Formula Recall;
- 8 түрлі Memory Drill;
- бір шақ бойынша 10 немесе 20 сұрақ;
- Present, Past, Future және contrast тесттері;
- 18 сұрақтық, 15 минуттық mock test;
- сұрақтар мен жауаптарды автоматты араластыру;
- толық нәтиже және тақырыптық талдау;
- қате дәптері және қатарынан екі дұрыс жауаптан кейін меңгеру;
- 0–1–3–7–14–30 күндік spaced repetition;
- апталық және тақырыптық Recharts диаграммалары;
- Zustand persist арқылы versioned localStorage;
- Admin Panel: сұрақ қосу, өңдеу, өшіру, active күйін өзгерту;
- формула карточкаларын Admin Panel арқылы өзгерту;
- Excel/CSV preview, validation және import;
- сұрақтарды Excel немесе CSV ретінде export;
- Light/Dark mode;
- GitHub Pages үшін дайын workflow.

## Технологиялар

- Next.js 16.2.10, App Router, TypeScript
- React 19
- Tailwind CSS
- shadcn/ui стиліндегі reusable UI компоненттері
- Lucide Icons
- Recharts 3
- Zustand
- SheetJS (`xlsx` import атауымен `@e965/xlsx` 0.20.3)
- localStorage

## Орнату

Node.js 22 ұсынылады.

```bash
npm install
npm run dev
```

Браузерде:

```text
http://localhost:3000
```

## Тексеру және production build

```bash
npm run typecheck
npm run build
```

`output: "export"` қосылғандықтан, build нәтижесі `out/` қалтасына түседі.

## GitHub Pages-ке жариялау

1. GitHub-та жаңа repository ашыңыз.
2. Осы жобаның барлық файлдарын repository түбіріне салыңыз.
3. `main` branch-ке push жасаңыз.
4. Repository ішінде `Settings → Pages` ашыңыз.
5. `Source` ретінде **GitHub Actions** таңдаңыз.
6. `.github/workflows/deploy-pages.yml` автоматты түрде build және deploy орындайды.

Workflow кәдімгі project repository мен `<username>.github.io` repository түрін автоматты ажыратады.

## Excel / CSV импорт

Дайын шаблон:

```text
public/Grammar_Sprint_18_Import_Template.xlsx
```

Қолдау көрсетілетін бағандар:

| Баған | Міндетті | Формат |
|---|---:|---|
| ID | Иә | Қайталанбайтын мәтін |
| Topic | Иә | Мысалы, Present Perfect |
| Subtopic | Жоқ | Question form |
| Question | Иә | Ағылшынша сұрақ |
| Option A | Иә | Жауап нұсқасы |
| Option B | Иә | Жауап нұсқасы |
| Option C | Иә | Жауап нұсқасы |
| Option D | Иә | Жауап нұсқасы |
| Correct Answer | Иә | `A`, `B`, `C`, `D` немесе толық жауап мәтіні |
| Explanation KZ | Иә | Қазақша түсіндірме |
| Difficulty | Иә | `easy`, `medium`, `hard` |
| Tags | Жоқ | Үтірмен бөлінеді |

Импорт кезінде файл браузер ішінде оқылады. Дерек серверге жіберілмейді.

## localStorage

Негізгі storage key:

```text
grammar-sprint-18:v1
```

Сақталатын деректер:

- профиль;
- custom/import сұрақтар;
- тест нәтижелері;
- қате дәптері;
- шақтар прогресі;
- қайталау кестесі;
- Admin Panel арқылы енгізілген formula overrides.

## Supabase-ке көшіру

`services/storage.ts` ішінде `ProgressRepository<T>` интерфейсі бар.

Келесі кезеңде:

1. `SupabaseProgressRepository` класын жасау;
2. Zustand persist орнына repository hydration қолдану;
3. `questions`, `results`, `mistakes`, `reviews`, `profiles` кестелерін қосу;
4. Row Level Security қосу жеткілікті.

## Негізгі файл құрылымы

```text
app/                 барлық route беттері
components/          reusable UI, navigation, quiz, charts
components/ui/       shadcn/ui стиліндегі primitive компоненттер
data/                 12 шақ және question bank
hooks/                quiz state hook
services/             spaced repetition және storage abstraction
store/                Zustand persisted store
types/                TypeScript data models
public/               Excel шаблоны, icon, manifest
.github/workflows/    GitHub Pages deploy
```

## Ескерту

Қазіргі нұсқа serverless және аккаунтсыз жұмыс істейді. Сондықтан прогресс пен импортталған сұрақтар бір браузердің localStorage жадында сақталады. Бірнеше құрылғы арасында синхрондау үшін келесі кезеңде Supabase қосылады.
