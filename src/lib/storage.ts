export interface TopicProgress {
  best: number;
  total: number;
  attempts: number;
}

export interface ProgressState {
  topics: Record<string, TopicProgress>;
}

const STORAGE_KEY = "gfm-pwa-progress-v1";

function emptyState(): ProgressState {
  return { topics: {} };
}

function readState(): ProgressState {
  if (typeof localStorage === "undefined") return emptyState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as ProgressState;
    if (!parsed || typeof parsed !== "object" || !parsed.topics) {
      return emptyState();
    }
    return parsed;
  } catch {
    return emptyState();
  }
}

function writeState(state: ProgressState): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Kuota penuh atau localStorage disekat: kemajuan tidak disimpan.
  }
}

export function getProgress(): ProgressState {
  return readState();
}

export function getTopicProgress(id: string): TopicProgress | undefined {
  return readState().topics[id];
}

export function recordResult(
  id: string,
  score: number,
  total: number,
): TopicProgress {
  const state = readState();
  const previous = state.topics[id];
  const next: TopicProgress = {
    best: Math.max(previous?.best ?? 0, score),
    total,
    attempts: (previous?.attempts ?? 0) + 1,
  };

  state.topics[id] = next;
  writeState(state);
  return next;
}

export function clearProgress(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Abaikan.
  }
}
