"use client";
import React, { useState } from "react";
import { InputValues } from "./InputValues";
import { Remove } from "../../compoments/inputs/remove";
import { Input } from "../../compoments/inputs/Input";
type Name = "amount" | "dateTime" | "receiver" | "payer";
export type Type = "number" | "text" | "date";

export const InputCreator = ({
  address,
  setData,
}: {
  address: `0x${string}`;
  setData: React.Dispatch<React.SetStateAction<InputValues[]>>;
}) => {
  const [inputs, setInputs] = useState<number[]>([]);
  const [values, setValues] = useState<InputValues[]>([]);

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

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    name: Name,
  ) => {
    const newValue = [...values];
    newValue[index][name] = event.target.value;
    setValues(newValue);
    setData(values);
  };

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
                <Remove
                  id={"remove" + index}
                  onClick={() => handleRemove(index)}
                />
              </div>
              <Input
                type="text"
                id={"Payer" + index}
                index={index}
                value={values[index].payer}
                onChange={(event) => handleInput(event, index, "payer")}
              >
                <> Payer Address</>
              </Input>
              <Input
                type="number"
                id={"Amount" + index}
                index={index}
                value={values[index].amount}
                onChange={(event) => handleInput(event, index, "amount")}
              >
                <> Token Amount</>
              </Input>
              <Input
                type="text"
                id={"Receiver" + index}
                index={index}
                value={values[index].receiver}
                onChange={(event) => handleInput(event, index, "receiver")}
              >
                <>Receiver address</>
              </Input>
              <Input
                type="date"
                id={"Date" + index}
                index={index}
                value={values[index].dateTime}
                onChange={(event) => handleInput(event, index, "dateTime")}
              >
                <>Date to unlock the payment</>
              </Input>
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
