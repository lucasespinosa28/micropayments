"use client";
export function shortAddress(words: string): string {
  const firstThreeWords = words.slice(0, 15);
  const lastThreeWords = words.slice(-15);
  return `${firstThreeWords}...${lastThreeWords}`;
}
