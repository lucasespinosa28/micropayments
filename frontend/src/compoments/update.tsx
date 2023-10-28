"use client";
import { BaseSyntheticEvent, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
function Inputs() {
  const [array, setArray] = useState([0]);
  const addressRef = useRef([]);
  const namesRef = useRef([]);
  const notesRef = useRef([]);
  const quantitiesRef = useRef([]);
  const amountsRef = useRef([]);
  const [total, setTotal] = useState([0]);

  const addAddressRef = (el: HTMLInputElement) => {
    if (el && !addressRef.current.includes(el)) {
      addressRef.current.push(el);
    }
  };

  const addNameRef = (el: HTMLInputElement) => {
    if (el && !namesRef.current.includes(el)) {
      namesRef.current.push(el);
    }
  };

  const addNotesRef = (el: HTMLInputElement) => {
    if (el && !notesRef.current.includes(el)) {
      notesRef.current.push(el);
    }
  };

  const addQuantitiesRef = (el: HTMLInputElement) => {
    if (el && !quantitiesRef.current.includes(el)) {
      quantitiesRef.current.push(el);
    }
  };

  const addAmountsRef = (el: HTMLInputElement) => {
    if (el && !amountsRef.current.includes(el)) {
      amountsRef.current.push(el);
    }
  };
  const handleSubmit = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    const json: object[] = []
    addressRef.current.forEach((input, index) => {
      const address: HTMLInputElement = input;
      const name: HTMLInputElement = addressRef.current[index];
      const note: HTMLInputElement = notesRef.current[index];
      const quantity: HTMLInputElement = quantitiesRef.current[index];
      const value: HTMLInputElement = amountsRef.current[index];
      json.push(
        {
          address: address.value,
          name: name.value,
          note: note.value,
          quantity: quantity.value,
          value: value.value,
        }
      );
    });
    console.log(JSON.stringify(json));
  };

  const addElement = () => {
    // Create a new array with additional elements
    const elements = [...array, array.length];
    setArray(elements);
    const totals = [...total, 0];
    setTotal(totals);
  };

  const remove = (index: number) => {
    const elements = [...array];
    elements.splice(index, 1);
    setArray(elements);
    const totals = [...total];
    totals.splice(index, 1);
    setTotal(totals);
    namesRef.current.splice(index, 1);
  };

  return (
    <div>
      <button id="addElement" onClick={addElement}>Add Elements</button>
      <button onClick={handleSubmit}>Show Input</button>
      <form id="formId" onSubmit={handleSubmit}>
        {array.map((item, index) => {
          return (
            <div key={index}>
              <input id={`address${index}`} ref={addAddressRef} type="text" placeholder="address" />
              <input id={`name${index}`} ref={addNameRef} type="text" placeholder="name" />
              <input id={`notes${index}`} ref={addNotesRef} type="text" placeholder="note" />
              <input
                ref={addQuantitiesRef}
                type="text"
                id={`quantity${index}`}
                placeholder="quantity"
                onChange={() => {
                  const arr = [...total];
                  const quantity: HTMLInputElement =
                    quantitiesRef.current[index];
                  const amount: HTMLInputElement = amountsRef.current[index];
                  arr[index] = Number(quantity.value) * Number(amount.value);
                  setTotal(arr);
                }}
              />
              <input
                ref={addAmountsRef}
                type="text"
                id={`amount${index}`}
                onChange={() => {
                  const arr = [...total];
                  const quantity: HTMLInputElement =
                    quantitiesRef.current[index];
                  const amount: HTMLInputElement = amountsRef.current[index];
                  arr[index] = Number(quantity.value) * Number(amount.value);
                  setTotal(arr);
                }}
                placeholder="amount"
              />
              <p  id={`total${index}`}>Total {total[index]}</p>
              <button id={`remove${index}`} onClick={() => remove(index)}>delete</button>
            </div>
          );
        })}
      </form>
    </div>
  );
}

export const Update = () => {
  return (
    <div>
      <Inputs />
      <QRCodeSVG
        size={484}
        value="helowqorldhelowqorldhelowqorldhelowqorldhelowqorld"
      />
      ,
    </div>
  );
};
