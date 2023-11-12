"use client";
import React, { useEffect, useState } from "react";
import { InputValues } from "./InputValues";

export const InputCreator = ({
  address,
  inputValues,
  paymentRef
}: {
  address:`0x${string}`
  inputValues: InputValues[],
  paymentRef:React.MutableRefObject<InputValues[]>
}) => {
  inputValues = inputValues.length > 0?inputValues:[];
  const length = Array.from({length: inputValues.length}, (_, i) => i);
  const [inputs, setInputs] = useState<number[]>(length);
  const [values, setValues] = useState<InputValues[]>(inputValues);
  paymentRef.current = inputValues;
  function handleAdd() {
    const newInputs = [...inputs];
    const newValues = [...values];
    newInputs.push(inputs.length);
    newValues.push({
      payer: address,
      amount: "",
      receiver: "",
      dateTime: "",
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

  const handleSubmit = () => {
    console.log(paymentRef.current);
  };

  return (
    <div>
      {inputs?.length > 0 &&
        inputs.map((_item, index) => {
          return (
            <div key={index}>
              <span>#{index + 1} </span>
              <label>Payer</label>
              <input
                type="text"
                placeholder={address}
                data-testid={`Payer${index}`}
                value={values[index].payer}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].payer = e.target.value;
                  setValues(newValue);
                  paymentRef.current = newValue;
                }}
              />
              <label>Amount</label>
              <input
                type="number"
                data-testid={`Amount${index}`}
                value={values[index].amount}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].amount = e.target.value;
                  setValues(newValue);
                  paymentRef.current = newValue;
                }}
              />
              <label>Receiver</label>
              <input
                type="text"
                data-testid={`Receiver${index}`}
                value={values[index].receiver}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].receiver = e.target.value;
                  setValues(newValue);
                  paymentRef.current = newValue;
                }}
              />
              <label>Date time</label>
              <input
                type="date"
                data-testid={`Date${index}`}
                value={values[index].dateTime}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].dateTime = e.target.value;
                  setValues(newValue);
                  paymentRef.current = newValue;
                }}
              />
              <button type="button" onClick={() => handleRemove(index)}>
                remove
              </button>
            </div>
          );
        })}
      <button data-testid="add" onClick={handleAdd}>
        add
      </button>
      <hr />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
