"use client";
import { Update } from "@/app/invoice/update";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center mx-2">
      <h1>Invoice</h1>
      <Link id="back" href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
          />
        </svg>
      </Link>
      <Update />
    </main>
  );
}
