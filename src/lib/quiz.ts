import type { Question, QuizItem } from "./types";

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Acak susunan soalan dan pilihan jawapan. `answerIndex` yang disimpan
 * merujuk kepada susunan pilihan yang telah diacak.
 */
export function buildQuiz(source: Question[], limit?: number): QuizItem[] {
  const picked = shuffle(source).slice(0, limit ?? source.length);

  return picked.map((question) => {
    const order = shuffle(question.options.map((_, index) => index));

    return {
      id: question.id,
      topicId: question.topicId,
      question: question.question,
      options: order.map((index) => question.options[index]),
      answerIndex: order.indexOf(question.answerIndex),
      explanation: question.explanation,
      sourceLabel: question.sourceLabel,
      diagram: question.diagram,
    };
  });
}

export function optionLetter(index: number): string {
  return "ABCD"[index] ?? "?";
}
