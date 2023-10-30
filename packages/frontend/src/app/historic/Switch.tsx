"use client";
import { useState } from "react";

export const Switch = ({
  offchain, onchain,
}: {
  offchain: JSX.Element;
  onchain: JSX.Element;
}) => {
  const [page, setPage] = useState<number>(1);
  return (
    <>
      <button onClick={() => setPage(1)}>Offchain</button>
      <button onClick={() => setPage(2)}>onchain</button>
      {page === 1 ? offchain : onchain}
    </>
  );
};
