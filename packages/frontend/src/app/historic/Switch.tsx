"use client";
import { useState } from "react";
export const Switch = ({
  offchain,
  onchain,
}: {
  offchain: JSX.Element;
  onchain: JSX.Element;
}) => {
  const [page, setPage] = useState<number>(1);

  return (
    <div>
      <div className="flex flex-row mx-2">
        <button
          className="disabled:bg-slate-600 disabled:text-slate-50  disabled:border-slate-600 flex justify-center items-center disabled:border disabled:rounded-t-lg"
          disabled={page !== 2}
          onClick={() => setPage(1)}
        >
          <span className="font-semibold">Offchain</span>
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
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>
        </button>
        <button
          className="disabled:bg-slate-600 disabled:text-slate-50 disabled:border-slate-600 flex justify-center items-center disabled:border disabled:rounded-t-lg"
          disabled={page !== 1}
          onClick={() => setPage(2)}
        >
          <span className="font-semibold">Onchain</span>
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
              d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
            />
          </svg>
        </button>
      </div>
      <div>{page === 1 ? offchain : onchain}</div>
    </div>
  );
};
