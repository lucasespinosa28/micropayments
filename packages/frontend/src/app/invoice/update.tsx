"use client";
import { BaseSyntheticEvent, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useSave } from "./useSave";
import { UploadData, Payments } from "./types";
import { v4 as uuidv4 } from "uuid";
import { CopyToClipboard } from "react-copy-to-clipboard";

// function isValidAddress(address: string): boolean {
//   const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
//   return ethereumAddressRegex.test(address);
// }

function Inputs() {
  const [array, setArray] = useState([0]);
  const addressRef = useRef([]);
  const namesRef = useRef([]);
  const notesRef = useRef([]);
  const quantitiesRef = useRef([]);
  const amountsRef = useRef([]);
  const [total, setTotal] = useState([0]);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);

  const addAddressRef = (el: HTMLInputElement) => {
    if (el && !addressRef.current.includes(el as never)) {
      addressRef.current.push(el as never);
    }
  };

  const addNameRef = (el: HTMLInputElement) => {
    if (el && !namesRef.current.includes(el as never)) {
      namesRef.current.push(el as never);
    }
  };

  const addNotesRef = (el: HTMLInputElement) => {
    if (el && !notesRef.current.includes(el as never)) {
      notesRef.current.push(el as never);
    }
  };

  const addQuantitiesRef = (el: HTMLInputElement) => {
    if (el && !quantitiesRef.current.includes(el as never)) {
      quantitiesRef.current.push(el as never);
    }
  };

  const addAmountsRef = (el: HTMLInputElement) => {
    if (el && !amountsRef.current.includes(el as never)) {
      amountsRef.current.push(el as never);
    }
  };

  const addElement = () => {
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

  const tokens = [
    "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
    "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
    "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
    "0xE4D517785D091D3c54818832dB6094bcc2744545",
    "add token address",
  ];
  const [tokenAddress, setTokenAddress] = useState<string>(
    "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTokenAddress(tokens[parseInt(event.target.value)]);
  };

  let options = ["Celo", "cUSD", "cEUR", "cREAL", "Custom"].map(
    (item, index) => (
      <option key={`${item}-${index}`} value={index}>
        {item}
      </option>
    )
  );

  const handleSubmit = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    const json: Payments[] = [];
    addressRef.current.forEach((input, index) => {
      const address: HTMLInputElement = input;
      const name: HTMLInputElement = addressRef.current[index];
      const note: HTMLInputElement = notesRef.current[index];
      const quantity: HTMLInputElement = quantitiesRef.current[index];
      const amount: HTMLInputElement = amountsRef.current[index];
      json.push({
        address: (address as HTMLInputElement).value,
        name: name.value,
        notes: note.value,
        quantity: parseInt(quantity.value),
        amount: amount.value,
      });
    });
    setUploadData({
      name: uuidv4(),
      body: { token: tokenAddress as `0x${string}`,payments:json },
    });
  };

  //
  return (
    <div>
      <select id="selectInput" onChange={handleChange}>
        {options}
      </select>
      <input
        id="tokenAddress"
        type="text"
        value={tokenAddress}
        onChange={(event) => setTokenAddress(event.target.value)}
      />
      <button id="addElement" onClick={addElement}>
        Add Elements
      </button>
      <form id="formId" onSubmit={handleSubmit}>
        {array.map((_, index) => {
          return (
            <div key={index}>
              <input
                id={`address${index}`}
                ref={addAddressRef}
                type="text"
                placeholder="address"
              />
              <input
                id={`name${index}`}
                ref={addNameRef}
                type="text"
                placeholder="name"
              />
              <input
                id={`notes${index}`}
                ref={addNotesRef}
                type="text"
                placeholder="note"
              />
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
              <p id={`total${index}`}>Total {total[index].toFixed(2)}</p>
              <button id={`remove${index}`} onClick={() => remove(index)}>
                delete
              </button>
            </div>
          );
        })}
        <button id="upload" type="submit">
          Save
        </button>
      </form>
      {uploadData && <Upload datas={uploadData} />}
      {uploadData?.name && (
        <>
          <h1 id="idText">id:{uploadData.name}</h1>
          {tokenAddress}
          <QRCodeSVG size={484} value={uploadData.name} />
          <CopyToClipboard text={uploadData.name}>
            <button id="clipboard">Copy to clipboard</button>
          </CopyToClipboard>
        </>
      )}
    </div>
  );
}

function Upload({ datas }: {datas: UploadData }) {
  const { data, loading, error } = useSave({payload:datas });
  if (loading) return <div>Loading...</div>;
  if (error != null) return <div>Error: {error.message}</div>;
  if (data) {
    return <>{JSON.stringify(data)}</>;
  }
}

export const Update = () => {
  return (
    <div>
      <Inputs />
    </div>
  );
};
