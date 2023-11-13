"use client";
import React, { useEffect, useState } from "react";
import { InputValues } from "./InputValues";

export const InputCreator = ({
  address,
  inputValues,
  setData
}: {
  address:`0x${string}`
  inputValues: InputValues[],
  setData: React.Dispatch<React.SetStateAction<InputValues[]>>
}) => {
  window.localStorage.setItem("address",address);
  inputValues = inputValues.length > 0?inputValues:[];
  const length = Array.from({length: inputValues.length}, (_, i) => i);
  const [inputs, setInputs] = useState<number[]>(length);
  const [values, setValues] = useState<InputValues[]>(inputValues);
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
    //console.log(values)
    setData(values)
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
                id={`Payer${index}`}
                value={values[index].payer}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].payer = e.target.value;
                  setValues(newValue);
                }}
              />
              <label>Amount</label>
              <input
                type="number"
                id={`Amount${index}`}
                value={values[index].amount}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].amount = e.target.value;
                  setValues(newValue);
                }}
              />
              <label>Receiver</label>
              <input
                type="text"
                id={`Receiver${index}`}
                value={values[index].receiver}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].receiver = e.target.value;
                  setValues(newValue);
                }}
              />
              <label>Date time</label>
              <input
                type="date"
                id={`Date${index}`}
                value={values[index].dateTime}
                onChange={(e) => {
                  const newValue = [...values];
                  newValue[index].dateTime = e.target.value;
                  setValues(newValue);
                }}
              />
              <button type="button" onClick={() => handleRemove(index)}>
                remove
              </button>
            </div>
          );
        })}
      <button id="addInput" onClick={handleAdd}>
        add
      </button>
      <hr />
      <button id="submit" onClick={handleSubmit}>Submit</button>
    </div>
  );
};
