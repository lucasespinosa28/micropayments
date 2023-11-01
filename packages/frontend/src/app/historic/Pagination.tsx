"use client";
import { useState } from "react";
import { Payments } from "./Payments";
import { useAutoAnimate } from "@formkit/auto-animate/react";
export const Pagination = ({
  data,
  pageLimit,
}: {
  data: string[];
  pageLimit: number;
}) => {
  const [parent] = useAutoAnimate(/* optional config */);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageLimit);
  const currentData = data.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(Number(event.target.value));
  };

  let options = Array.from({ length: totalPages }, (_, index) => index + 1).map(
    (item, index) => (
      <option key={`${item}-${index}`} value={item}>
        {item}
      </option>
    )
  );
  const Buttons = () => {
    return (
      <div className="flex justify-center items-center">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
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
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
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
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <select value={currentPage} onChange={handleChange}>
          {options}
        </select>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
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
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
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
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    );
  };
  if (data.length > 0) {
    return (
      <div>
        <Buttons />
        <div ref={parent}>
          {currentData.map((item) => (
            <div className="my-5" key={`${item}-{index}`}>
              <Payments id={item} />
              <hr />
            </div>
          ))}
        </div>
        <Buttons />
      </div>
    );
  }
  return <></>;
};
