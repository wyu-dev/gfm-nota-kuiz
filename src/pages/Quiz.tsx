import { useEffect, useRef, useState } from "preact/hooks";
import { ProgressBar } from "../components/ProgressBar";
import { getTopic, questions, questionsForTopic } from "../lib/content";
import { buildQuiz, optionLetter } from "../lib/quiz";
import { href } from "../lib/router";
import { recordResult } from "../lib/storage";
import type { AnswerRecord, QuizItem, Topic } from "../lib/types";
import { NotFoundPage } from "./NotFound";

const CHALLENGE_SIZE = 20;

interface PageProps {
  id: string;
}

export function QuizPage({ id }: PageProps) {
  if (id !== "semua" && !getTopic(id)) return <NotFoundPage />;
  return <QuizRunner id={id} />;
}

interface RunnerProps {
  id: string;
}

function QuizRunner({ id }: RunnerProps) {
  const topic: Topic | undefined = id === "semua" ? undefined : getTopic(id);
  const pool = topic ? questionsForTopic(topic.id) : questions;
  const limit = topic ? undefined : CHALLENGE_SIZE;

  const [quiz, setQuiz] = useState<QuizItem[]>(() => buildQuiz(pool, limit));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);
  const recorded = useRef(false);

  const score = answers.filter(
    (answer) => answer.selectedIndex === answer.correctIndex,
  ).length;

  useEffect(() => {
    if (!finished || recorded.current) return;
    recorded.current = true;
    recordResult(id, score, quiz.length);
  }, [finished, id, score, quiz.length]);

  const select = (optionIndex: number) => {
    if (selected !== null) return;
    const item = quiz[index];
    if (!item) return;

    setSelected(optionIndex);
    setAnswers((previous) => [
      ...previous,
      {
        questionId: item.id,
        selectedIndex: optionIndex,
        correctIndex: item.answerIndex,
      },
    ]);
  };

  const next = () => {
    if (selected === null) return;

    if (index + 1 >= quiz.length) {
      setFinished(true);
      window.scrollTo(0, 0);
      return;
    }

    setIndex((value) => value + 1);
    setSelected(null);
    window.scrollTo(0, 0);
  };

  const restart = () => {
    recorded.current = false;
    setQuiz(buildQuiz(pool, limit));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (finished) return;

      if (selected === null) {
        const key = event.key.toLowerCase();
        const fromNumber = "1234".indexOf(key);
        const fromLetter = "abcd".indexOf(key);
        const option = fromNumber >= 0 ? fromNumber : fromLetter;

        if (option >= 0 && option < 4) {
          event.preventDefault();
          select(option);
        }
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (quiz.length === 0) {
    return (
      <div class="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 class="text-xl font-black text-slate-950">Tiada soalan</h1>
        <p class="mt-2 text-[15px] text-slate-500">
          Topik ini belum mempunyai soalan kuiz.
        </p>
        <a href={href("/")} class="btn-primary mt-6">
          Kembali ke laman utama
        </a>
      </div>
    );
  }

  if (finished) {
    return (
      <ResultView
        quiz={quiz}
        answers={answers}
        topic={topic}
        score={score}
        onRestart={restart}
      />
    );
  }

  const item = quiz[index];
  const answered = selected !== null;
  const isCorrect = answered && selected === item.answerIndex;
  const progressValue = index + (answered ? 1 : 0);
  const title = topic ? topic.title : "Cabaran Rawak";
  const backTo = topic ? `/nota/${topic.id}` : "/";

  return (
    <div class="mx-auto max-w-2xl px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-8">
      <nav
        class="mb-4 text-[13px] font-medium text-slate-500"
        aria-label="Jejak"
      >
        <a href={href("/")} class="hover:text-indigo-600">
          Laman utama
        </a>
        <span class="mx-1.5" aria-hidden="true">
          /
        </span>
        <a href={href(backTo)} class="hover:text-indigo-600">
          {topic ? topic.title : "Kuiz"}
        </a>
        <span class="mx-1.5" aria-hidden="true">
          /
        </span>
        <span class="text-slate-800">Kuiz</span>
      </nav>

      <header class="mb-5">
        <div class="flex items-end justify-between gap-4">
          <div class="min-w-0">
            <span class="chip bg-white text-indigo-700 ring-1 ring-inset ring-slate-200">
              {topic ? topic.module : "Semua topik"}
            </span>
            <h1 class="mt-2 truncate text-[22px] font-black tracking-tight text-slate-950 sm:text-2xl">
              {title}
            </h1>
          </div>
          <p class="shrink-0 pb-0.5 text-[15px] font-bold tabular-nums text-slate-900">
            {index + 1}
            <span class="font-medium text-slate-400">/{quiz.length}</span>
          </p>
        </div>
        <ProgressBar value={progressValue} max={quiz.length} class="mt-4" />
      </header>

      <section class="card p-5 sm:p-8" aria-labelledby="soalan-heading">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="chip bg-slate-100 text-slate-600">
            {item.sourceLabel}
          </span>
          <span class="text-[13px] font-semibold text-slate-400">
            Soalan {index + 1} daripada {quiz.length}
          </span>
        </div>

        <h2
          id="soalan-heading"
          class="mt-4 text-[21px] font-bold leading-snug tracking-[-0.01em] text-slate-950 sm:text-2xl"
        >
          {item.question}
        </h2>

        {item.diagram && (
          <figure class="quiz-diagram mt-4 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
            <div dangerouslySetInnerHTML={{ __html: item.diagram }} />
          </figure>
        )}

        <div class="mt-5 grid gap-3">
          {item.options.map((option, optionIndex) => {
            const showCorrect = answered && optionIndex === item.answerIndex;
            const showWrong =
              answered &&
              optionIndex === selected &&
              optionIndex !== item.answerIndex;

            let buttonClass =
              "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40";
            let badgeClass = "bg-slate-50 text-slate-600 ring-slate-200";

            if (answered) {
              if (showCorrect) {
                buttonClass = "border-emerald-300 bg-emerald-50";
                badgeClass = "bg-emerald-600 text-white ring-emerald-600";
              } else if (showWrong) {
                buttonClass = "border-rose-300 bg-rose-50";
                badgeClass = "bg-rose-600 text-white ring-rose-600";
              } else {
                buttonClass = "border-slate-200 bg-white opacity-50";
                badgeClass = "bg-slate-50 text-slate-400 ring-slate-200";
              }
            }

            return (
              <button
                key={`${item.id}-${optionIndex}`}
                type="button"
                class={`group flex min-h-[60px] w-full items-center gap-3.5 rounded-xl border p-4 text-left text-[15px] transition sm:text-base ${buttonClass}`}
                onClick={() => select(optionIndex)}
                disabled={answered}
                aria-pressed={selected === optionIndex}
              >
                <span
                  class={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-bold ring-1 ring-inset ${badgeClass}`}
                >
                  {optionLetter(optionIndex)}
                </span>
                <span class="min-w-0 flex-1 font-medium leading-relaxed text-slate-800">
                  {option}
                </span>
                {showCorrect && (
                  <svg
                    class="h-5 w-5 shrink-0 text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                )}
                {showWrong && (
                  <svg
                    class="h-5 w-5 shrink-0 text-rose-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            class={`mt-5 rounded-2xl border p-5 ${
              isCorrect
                ? "border-emerald-200 bg-emerald-50"
                : "border-rose-200 bg-rose-50"
            }`}
            role="status"
            aria-live="polite"
          >
            <p
              class={`flex items-center gap-2.5 text-[15px] font-bold ${
                isCorrect ? "text-emerald-800" : "text-rose-800"
              }`}
            >
              <span
                class={`grid h-7 w-7 place-items-center rounded-full text-white ${
                  isCorrect ? "bg-emerald-600" : "bg-rose-600"
                }`}
              >
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  {isCorrect ? (
                    <path d="m5 13 4 4L19 7" />
                  ) : (
                    <path d="m6 6 12 12M18 6 6 18" />
                  )}
                </svg>
              </span>
              {isCorrect ? "Betul!" : "Belum tepat"}
            </p>

            {!isCorrect && (
              <p class="mt-2.5 text-[15px] leading-relaxed text-rose-900">
                Jawapan tepat:{" "}
                <strong class="font-bold">
                  {optionLetter(item.answerIndex)}.{" "}
                  {item.options[item.answerIndex]}
                </strong>
              </p>
            )}

            {item.explanation && (
              <div
                class={`mt-3.5 border-t pt-3.5 ${
                  isCorrect ? "border-emerald-200" : "border-rose-200"
                }`}
              >
                <p
                  class={`text-[11px] font-bold uppercase tracking-[0.14em] ${
                    isCorrect ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  Penjelasan
                </p>
                <p
                  class={`mt-1.5 whitespace-pre-line text-[15px] leading-relaxed ${
                    isCorrect ? "text-emerald-900" : "text-rose-900"
                  }`}
                >
                  {item.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        <div class="mt-5">
          <button
            type="button"
            class="btn-primary w-full sm:ml-auto sm:w-auto"
            onClick={next}
            disabled={!answered}
          >
            {index + 1 >= quiz.length ? "Lihat keputusan" : "Soalan seterusnya"}
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      <p class="mt-4 hidden text-center text-[12px] text-slate-400 sm:block">
        Tekan <kbd class="rounded bg-white px-1.5 py-0.5 font-sans ring-1 ring-slate-200">1</kbd>–
        <kbd class="rounded bg-white px-1.5 py-0.5 font-sans ring-1 ring-slate-200">4</kbd> atau{" "}
        <kbd class="rounded bg-white px-1.5 py-0.5 font-sans ring-1 ring-slate-200">A</kbd>–
        <kbd class="rounded bg-white px-1.5 py-0.5 font-sans ring-1 ring-slate-200">D</kbd> untuk
        memilih. Tekan <kbd class="rounded bg-white px-1.5 py-0.5 font-sans ring-1 ring-slate-200">Enter</kbd>{" "}
        untuk teruskan.
      </p>
    </div>
  );
}

interface ResultProps {
  quiz: QuizItem[];
  answers: AnswerRecord[];
  topic: Topic | undefined;
  score: number;
  onRestart: () => void;
}

function ResultView({ quiz, answers, topic, score, onRestart }: ResultProps) {
  const total = quiz.length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const wrong = quiz
    .map((item, itemIndex) => ({ item, answer: answers[itemIndex] }))
    .filter(
      (entry) =>
        entry.answer && entry.answer.selectedIndex !== entry.item.answerIndex,
    );

  const ringClass =
    percent >= 80
      ? "stroke-emerald-500"
      : percent >= 60
        ? "stroke-indigo-500"
        : percent >= 40
          ? "stroke-amber-500"
          : "stroke-rose-500";

  const message =
    percent >= 80
      ? "Cemerlang!"
      : percent >= 60
        ? "Bagus, teruskan!"
        : percent >= 40
          ? "Boleh diperbaiki lagi."
          : "Jangan putus asa.";

  const detail =
    percent >= 80
      ? "Penguasaan anda sangat baik. Cuba topik lain atau ulang untuk kekalkan momentum."
      : percent >= 60
        ? "Asas anda sudah kukuh. Semak soalan yang salah untuk tingkatkan lagi."
        : "Baca semula nota topik ini, kemudian cuba kuiz sekali lagi.";

  const circumference = 2 * Math.PI * 52;
  const dash = (percent / 100) * circumference;

  return (
    <div class="mx-auto max-w-2xl px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-8">
      <section class="card overflow-hidden">
        <div class="bg-slate-950 px-6 py-9 text-center text-white sm:px-8">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Kuiz selesai
          </p>
          <h1 class="mt-2 text-[26px] font-black tracking-tight sm:text-3xl">
            {topic ? topic.title : "Cabaran Rawak"}
          </h1>

          <div class="relative mx-auto mt-7 h-36 w-36">
            <svg
              class="h-36 w-36 -rotate-90"
              viewBox="0 0 120 120"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                stroke-width="10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                class={ringClass}
                stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray={`${dash} ${circumference}`}
              />
            </svg>
            <div class="absolute inset-0 grid place-items-center">
              <div>
                <p class="text-4xl font-black leading-none tabular-nums">
                  {percent}%
                </p>
                <p class="mt-1.5 text-[13px] font-medium text-slate-400">
                  {score}/{total} betul
                </p>
              </div>
            </div>
          </div>

          <h2 class="mt-6 text-xl font-bold">{message}</h2>
          <p class="mx-auto mt-1.5 max-w-md text-[15px] leading-relaxed text-slate-400">
            {detail}
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3 p-5 sm:p-6">
          <div class="rounded-xl bg-emerald-50 p-4 text-center ring-1 ring-inset ring-emerald-100">
            <p class="text-[26px] font-black leading-none text-emerald-700">
              {score}
            </p>
            <p class="mt-1.5 text-[12px] font-semibold text-emerald-700">
              Betul
            </p>
          </div>
          <div class="rounded-xl bg-rose-50 p-4 text-center ring-1 ring-inset ring-rose-100">
            <p class="text-[26px] font-black leading-none text-rose-700">
              {total - score}
            </p>
            <p class="mt-1.5 text-[12px] font-semibold text-rose-700">Salah</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-inset ring-slate-200">
            <p class="text-[26px] font-black leading-none text-slate-700">
              {total}
            </p>
            <p class="mt-1.5 text-[12px] font-semibold text-slate-600">
              Soalan
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-2 border-t border-slate-100 p-5 sm:flex-row sm:p-6">
          <button type="button" class="btn-primary flex-1" onClick={onRestart}>
            Cuba lagi
          </button>
          <a
            href={href(topic ? `/nota/${topic.id}` : "/")}
            class="btn-secondary flex-1"
          >
            {topic ? "Baca semula nota" : "Kembali ke laman utama"}
          </a>
        </div>
      </section>

      {wrong.length > 0 ? (
        <section class="mt-8" aria-labelledby="semak-heading">
          <div class="mb-3">
            <p class="eyebrow">Ulang kaji</p>
            <h2
              id="semak-heading"
              class="mt-1.5 text-[22px] font-black tracking-tight text-slate-950"
            >
              Semak jawapan
            </h2>
            <p class="mt-1 text-[14px] text-slate-500">
              {wrong.length} soalan perlu diulang.
            </p>
          </div>

          <div class="space-y-3">
            {wrong.map(({ item, answer }) => (
              <details class="card overflow-hidden" key={item.id}>
                <summary class="flex cursor-pointer list-none items-start gap-3 p-4 text-[15px] font-semibold leading-snug text-slate-900 hover:bg-slate-50 sm:p-5">
                  <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-100 text-[12px] font-bold text-rose-700">
                    {optionLetter(answer.selectedIndex)}
                  </span>
                  <span class="min-w-0 flex-1">{item.question}</span>
                  <svg
                    class="mt-1 h-4 w-4 shrink-0 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div class="border-t border-slate-100 p-4 text-[15px] sm:p-5">
                  {item.diagram && (
                    <figure class="quiz-diagram mb-4 rounded-xl border border-slate-200 bg-white p-3">
                      <div dangerouslySetInnerHTML={{ __html: item.diagram }} />
                    </figure>
                  )}
                  <p class="leading-relaxed text-rose-700">
                    <span class="font-semibold">Jawapan anda:</span>{" "}
                    {optionLetter(answer.selectedIndex)}.{" "}
                    {item.options[answer.selectedIndex]}
                  </p>
                  <p class="mt-1.5 leading-relaxed text-emerald-700">
                    <span class="font-semibold">Jawapan tepat:</span>{" "}
                    {optionLetter(item.answerIndex)}.{" "}
                    {item.options[item.answerIndex]}
                  </p>
                  {item.explanation && (
                    <div class="mt-4 rounded-xl bg-slate-50 p-4">
                      <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Penjelasan
                      </p>
                      <p class="mt-1.5 whitespace-pre-line leading-relaxed text-slate-700">
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : (
        <section class="card mt-8 p-7 text-center">
          <span
            class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600"
            aria-hidden="true"
          >
            <svg
              class="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          <h2 class="mt-4 text-xl font-black text-slate-950">
            Semua jawapan betul!
          </h2>
          <p class="mx-auto mt-1.5 max-w-sm text-[15px] leading-relaxed text-slate-500">
            Tiada soalan untuk disemak. Cuba topik lain atau ulang kuiz ini.
          </p>
        </section>
      )}
    </div>
  );
}
