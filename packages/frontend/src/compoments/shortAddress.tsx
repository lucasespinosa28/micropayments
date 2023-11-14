"use client";
export function shortAddress(words: string, length: number): string {
  const firstThreeWords = words.slice(0, length + 2);
  const lastThreeWords = words.slice(-length);
  return `${firstThreeWords}...${lastThreeWords}`;
}
