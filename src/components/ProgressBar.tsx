interface Props {
  value: number;
  max: number;
  class?: string;
  barClass?: string;
}

export function ProgressBar({
  value,
  max,
  class: className = "",
  barClass = "bg-indigo-600",
}: Props) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      class={`h-2 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div
        class={`h-full rounded-full transition-all duration-300 ${barClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
