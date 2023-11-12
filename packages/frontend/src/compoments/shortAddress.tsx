"use client";
export function shortAddress(words: string): string {
  const firstThreeWords = words.slice(0, 5);
  const lastThreeWords = words.slice(-3);
  return `${firstThreeWords}...${lastThreeWords}`;
}
