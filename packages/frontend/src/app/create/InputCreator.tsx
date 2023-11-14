"use client";
import React, { useEffect, useState } from "react";
import { InputValues } from "./InputValues";

// function validAddress(address: `0x${string}`) {
//   return /^0x[a-fA-F0-9]{40}$/.test(address)
// }
export const InputCreator = ({
  address,
  inputValues,
  setData,
}: {
  address: `0x${string}`;
  inputValues: InputValues[];
  setData: React.Dispatch<React.SetStateAction<InputValues[]>>;
}) => {
  window.localStorage.setItem("address", address);
  inputValues = inputValues.length > 0 ? inputValues : [];
  const length = Array.from({ length: inputValues.length }, (_, i) => i);
  const [inputs, setInputs] = useState<number[]>(length);
  const [values, setValues] = useState<InputValues[]>(inputValues);
  function handleAdd() {
    const newInputs = [...inputs];
    const newValues = [...values];
    newInputs.push(inputs.length);
    newValues.push({
      payer: address,
      amount: "0.0",
      receiver: "",
      dateTime: new Date().toISOString().split("T")[0],
    });
    setInputs(newInputs);
    setValues(newValues);
  }
  const handleRemove = (index: number) => {
    const newInputs = [...inputs];
    const newValues = [...values];
    newInputs.splice(index, 1);
    newValues.splice(index, 1);
    setInputs(newInputs);
    setValues(newValues);
  };

  const handleInput = (event:React.ChangeEvent<HTMLInputElement>,index:number) =>{
    const newValue = [...values];
    newValue[index].payer = event.target.value;
    setValues(newValue);
    setData(values);
  }

  return (
    <div className="flex flex-col  w-full">
      {inputs?.length > 0 &&
        inputs.map((_item, index) => {
          return (
            <div
              key={index}
              className="flex flex-col m-2 shadow-md border-t border-sky-500 text-xl"
            >
              <div className="flex justify-between">
                <span className="m-1 font-bold">#{index + 1}</span>
                <button
                  className="m-1 bg-red-500 text-white border rounded border-red-700"
                  type="button"
                  onClick={() => handleRemove(index)}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <span className="h-2"></span>
              <div>
                <label className="text-white bg-sky-500 rounded border-sky-500 p-1 ml-2">
                  Payer Address
                </label>
              </div>

              <input
                type="text"
                className="border px-1 mx-1 rounded border-sky-500 "
                placeholder={address}
                id={`Payer${index}`}
                value={values[index].payer}
                onChange={(event) => handleInput(event, index)}
              />
              <span className="h-2"></span>
              <div>
                <label className="text-white bg-sky-500 rounded border-sky-500 p-1 ml-2">
                  Token Amount
                </label>
              </div>
              <input
                type="number"
                className="border px-1 mx-1 rounded border-sky-500 "
                id={`Amount${index}`}
                value={values[index].amount}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].amount = e.target.value;
                  setValues(newValue);
                  setData(values);
                }}
              />
              <span className="h-2"></span>
              <div>
                <label className="text-white bg-sky-500 rounded border-sky-500 p-1 ml-2">
                  Receiver address
                </label>
              </div>

              <input
                type="text"
                className="border px-1 mx-1 rounded border-sky-500 "
                id={`Receiver${index}`}
                value={values[index].receiver}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].receiver = e.target.value;
                  setValues(newValue);
                  setData(values);
                }}
              />
              <span className="h-2" />
              <div>
                <label className="text-white bg-sky-500 rounded border-sky-500 p-1 ml-2">
                  Date to unlock the payment
                </label>
              </div>
              <input
                type="date"
                className="border px-1 mx-1 rounded border-sky-500 "
                id={`Date${index}`}
                value={values[index].dateTime}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].dateTime = e.target.value;
                  setValues(newValue);
                  setData(values);
                }}
              />
            </div>
          );
        })}
      <div className="flex justify-center text-white font-bold">
        <button
          className="flex flex-row bg-lime-500 border-lime-700 p-2 m-2 border rounded"
          id="addInput"
          onClick={handleAdd}
        >
          Add more payments
        </button>
      </div>
      <hr />
    </div>
  );
};
