"use client";
import { useState } from "react";
import { Payments } from "./Payments";

export const Pagination = ({
  data, pageLimit,
}: {
  data: string[];
  pageLimit: number;
}) => {
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
  const buttons = () => {
    return (
      <>
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          First
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <select value={currentPage} onChange={handleChange}>
          {options}
        </select>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </>
    );
  };
  return (
    <div>
      {buttons()}
      {currentData.map((item) => (
        <div key={`${item}-{index}`}>
          <hr />
          <h3 className="Title">{item}</h3>
          <Payments id={item} />
          <hr />
        </div>
      ))}
      {buttons()}
    </div>
  );
};
