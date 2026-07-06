export const synonyms = [
  "interesting",
  "impossible",
  "quiet",
  "messy",
  "human",
] as const;

export const proximityFragments = [
  { id: "doubt", text: "doubt is useful", x: 78, y: 14 },
  { id: "whisper", text: "what if type could whisper", x: 6, y: 38 },
  { id: "meridian", text: "Meridian · 2025", x: 12, y: 72, projectId: "meridian" },
  { id: "forma", text: "Forma · 2024", x: 88, y: 58, projectId: "forma" },
  { id: "northwind", text: "Northwind · 2024", x: 52, y: 8, projectId: "northwind" },
  { id: "atlas", text: "Atlas · 2023", x: 34, y: 88, projectId: "atlas" },
  { id: "question", text: "every project begins with a question", x: 72, y: 82 },
] as const;

export const projects = [
  {
    id: "meridian",
    question: "What happens when a bank feels human?",
    title: "Meridian",
    year: "2025",
  },
  {
    id: "forma",
    question: "Why does silence need a typeface?",
    title: "Forma Studio",
    year: "2024",
  },
  {
    id: "northwind",
    question: "Can a system feel calm?",
    title: "Northwind",
    year: "2024",
  },
  {
    id: "atlas",
    question: "What if a journal had no cover?",
    title: "Atlas Journal",
    year: "2023",
  },
] as const;

export const experiments = [
  { title: "Type Drift", note: "Letters that forget their weight" },
  { title: "Quiet Grid", note: "Structure without shouting" },
  { title: "Half Sentences", note: "Copy that stops on purpose" },
] as const;
