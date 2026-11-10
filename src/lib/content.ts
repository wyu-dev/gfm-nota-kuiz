import raw from "../data/content.json";
import type { ContentData, Question, Topic } from "./types";

const data = raw as unknown as ContentData;

export const topics: Topic[] = data.topics;
export const questions: Question[] = data.questions;
export const meta = data.meta;
export const totalQuestions: number = data.questions.length;

export function getTopic(id: string | undefined): Topic | undefined {
  if (!id) return undefined;
  return topics.find((topic) => topic.id === id);
}

export function getTopicIndex(id: string): number {
  return topics.findIndex((topic) => topic.id === id);
}

export function questionsForTopic(id: string): Question[] {
  return questions.filter((question) => question.topicId === id);
}

export function countForTopic(id: string): number {
  return meta.counts[id] ?? 0;
}

export function nextTopic(id: string): Topic | undefined {
  const index = getTopicIndex(id);
  if (index < 0) return undefined;
  return topics[index + 1];
}
