export type TopicAccent = "blue" | "emerald" | "violet" | "amber" | "rose";
export type TopicIconName = "ruler" | "map" | "triangle" | "calculator" | "chart";

export interface Topic {
  id: string;
  module: string;
  title: string;
  subtitle: string;
  icon: TopicIconName;
  accent: TopicAccent;
  note: string;
}

export interface Question {
  id: number;
  topicId: string;
  source: string;
  sourceLabel: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  diagram?: string;
}

export interface ContentMeta {
  totalQuestions: number;
  counts: Record<string, number>;
}

export interface ContentData {
  version: number;
  topics: Topic[];
  questions: Question[];
  meta: ContentMeta;
}

export interface QuizItem {
  id: number;
  topicId: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  sourceLabel: string;
  diagram?: string;
}

export interface AnswerRecord {
  questionId: number;
  selectedIndex: number;
  correctIndex: number;
}
