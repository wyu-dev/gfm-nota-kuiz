import type { TopicIconName } from "../lib/types";

interface Props {
  name: TopicIconName;
  class?: string;
}

export function TopicIcon({ name, class: className = "h-5 w-5" }: Props) {
  const common = {
    class: className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.8",
    "stroke-linecap": "round" as const,
    "stroke-linejoin": "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "ruler":
      return (
        <svg {...common}>
          <path d="M3.5 17.5 17.5 3.5l3 3-14 14z" />
          <path d="m7 14 2 2M10 11l2 2M13 8l2 2" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    case "triangle":
      return (
        <svg {...common}>
          <path d="M12 4 3 20h18L12 4z" />
          <path d="M12 12v8" />
          <path d="M9.5 16h5" />
        </svg>
      );
    case "calculator":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2.5" />
          <path d="M8.5 7.5h7" />
          <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01M8.5 19h.01M12 19h.01M15.5 19h.01" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 4v16h16" />
          <path d="m7 15 4-5 3 3 5-7" />
        </svg>
      );
  }
}
