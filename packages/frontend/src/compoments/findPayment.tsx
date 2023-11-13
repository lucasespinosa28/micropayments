import { Payments } from "@/app/Payments";
import { useRef, useState } from "react";
import { stringToHex } from "viem";
//
export const FindPayment = ({ address }: { address: `0x${string}` }) => {
  const value = useRef("");
  const [id, setId] = useState<string>("");
  return (
    <>
      <h2 className="font-bold text-2xl text-center drop-shadow-md">Find payment using id</h2>
      <div className="flex justify-center w-full items-center my-4">
        <input
          type="text"
          className="border-solid border-2 border-sky-500 h-10 rounded-l-lg"
          name=""
          id=""
          onChange={(e) => (value.current = e.target.value)}
        />
        <button
          className="flex flex-row bg-sky-500 text-white font-bold pt-2 pr-2 h-10 shadow-md rounded-r-lg"
          onClick={() => {
            setId(value.current);
          }}
        >
          <span className="flex flex-row justify-center items-center">
            <p>Find</p>
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
                d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </button>
      </div>

      {id.length > 0 && (
        <Payments
          key={id}
          id={stringToHex(id, { size: 32 })}
          address={address}
        />
      )}
    </>
  );
};
