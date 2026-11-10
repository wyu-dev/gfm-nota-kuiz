import { countForTopic } from "../lib/content";
import { href } from "../lib/router";
import { getTopicProgress } from "../lib/storage";
import type { Topic } from "../lib/types";
import { ProgressBar } from "./ProgressBar";
import { TopicIcon } from "./TopicIcon";

const ACCENTS = {
  blue: {
    chip: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: "bg-blue-50 text-blue-700",
    top: "bg-blue-500",
    bar: "bg-blue-600",
  },
  emerald: {
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: "bg-emerald-50 text-emerald-700",
    top: "bg-emerald-500",
    bar: "bg-emerald-600",
  },
  violet: {
    chip: "bg-violet-50 text-violet-700 ring-violet-200",
    icon: "bg-violet-50 text-violet-700",
    top: "bg-violet-500",
    bar: "bg-violet-600",
  },
  amber: {
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: "bg-amber-50 text-amber-700",
    top: "bg-amber-500",
    bar: "bg-amber-500",
  },
  rose: {
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: "bg-rose-50 text-rose-700",
    top: "bg-rose-500",
    bar: "bg-rose-500",
  },
} as const;

interface Props {
  topic: Topic;
}

export function TopicCard({ topic }: Props) {
  const accent = ACCENTS[topic.accent];
  const count = countForTopic(topic.id);
  const progress = getTopicProgress(topic.id);

  return (
    <article class="card group relative flex flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-6">
      <span
        class={`absolute inset-x-0 top-0 h-1 ${accent.top}`}
        aria-hidden="true"
      />

      <div class="mb-4 flex items-start justify-between gap-3">
        <span
          class={`grid h-12 w-12 place-items-center rounded-2xl ${accent.icon}`}
        >
          <TopicIcon name={topic.icon} class="h-6 w-6" />
        </span>
        <span class={`chip ring-1 ring-inset ${accent.chip}`}>
          {topic.module}
        </span>
      </div>

      <h2 class="text-[21px] font-black leading-tight tracking-tight text-slate-950">
        {topic.title}
      </h2>
      <p class="mt-1.5 text-[15px] leading-relaxed text-slate-500">
        {topic.subtitle}
      </p>

      <div class="mt-auto pt-5">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-semibold text-slate-500">
          <span>{count} soalan</span>
          {progress && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Rekod terbaik {progress.best}/{progress.total}
              </span>
            </>
          )}
        </div>

        {progress && (
          <ProgressBar
            value={progress.best}
            max={progress.total}
            class="mt-2"
            barClass={accent.bar}
          />
        )}

        <div class="mt-4 flex gap-2">
          <a
            href={href(`/nota/${topic.id}`)}
            class="btn min-h-[48px] flex-1 bg-slate-950 px-4 text-white hover:bg-slate-800"
          >
            Baca nota
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
          </a>
          <a
            href={href(`/kuiz/${topic.id}`)}
            class="btn-secondary min-h-[48px] flex-1 px-4"
          >
            Kuiz
          </a>
        </div>
      </div>
    </article>
  );
}
