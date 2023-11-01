"use client";
import {
  BaseSyntheticEvent,
  MouseEventHandler,
  MutableRefObject,
  ReactNode,
  useRef,
  useState,
} from "react";
import { QRCodeSVG } from "qrcode.react";
import { useSave } from "./useSave";
import { UploadData, Payments } from "./types";
import { v4 as uuidv4 } from "uuid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AlertSuccess } from "../../compoments/alert";

const inputCss = "border border-gray-300 text-lg px-1 w-full";
const labelCss =
  "border border-slate-600 text-lg px-1 bg-slate-600 text-slate-50 w-28";
// function isValidAddress(address: string): boolean {
//   const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
//   return ethereumAddressRegex.test(address);
// }

const Button = ({
  id,
  text,
  onClick,
  children,
  type,
}: {
  id: string;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  type: "button" | "submit" | "reset";
}) => {
  return (
    <div className="flex justify-center">
      <button
        className="flex flex-row m-1 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-400 active:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        id={id}
        onClick={onClick}
        type={type}
      >
        <span>{text}</span>
        {children}
      </button>
    </div>
  );
};

function addRef(
  addressRef: MutableRefObject<HTMLInputElement[]>,
  namesRef: MutableRefObject<HTMLInputElement[]>,
  notesRef: MutableRefObject<HTMLInputElement[]>,
  quantitiesRef: MutableRefObject<HTMLInputElement[]>,
  amountsRef: MutableRefObject<HTMLInputElement[]>,
  totalRef: MutableRefObject<HTMLInputElement[]>
) {
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
  const addTotalRef = (el: HTMLInputElement) => {
    if (el && !totalRef.current.includes(el)) {
      totalRef.current.push(el);
    }
  };
  return {
    addAddressRef,
    addNameRef,
    addNotesRef,
    addQuantitiesRef,
    addAmountsRef,
    addTotalRef,
  };
}

function Upload({ datas }: { datas: UploadData }) {
  const { data, loading, error } = useSave({ payload: datas });
  if (loading) return <div>Loading...</div>;
  if (error != null) return <div>Error: {error.message}</div>;
  if (data) {
    return (
      <AlertSuccess message="Your invoice data has been saved successfully." />
    );
  }
}

export const Update = () => {
  const [array, setArray] = useState([0]);
  const addressRef = useRef([]);
  const namesRef = useRef([]);
  const notesRef = useRef([]);
  const quantitiesRef = useRef([]);
  const amountsRef = useRef([]);
  const totalRef = useRef([]);
  const [total, setTotal] = useState([0]);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [idNumber, setIdNumber] = useState<number>(0);
  const {
    addAddressRef,
    addNameRef,
    addNotesRef,
    addQuantitiesRef,
    addAmountsRef,
    addTotalRef,
  } = addRef(
    addressRef,
    namesRef,
    notesRef,
    quantitiesRef,
    amountsRef,
    totalRef
  );

  const addElement = () => {
    const elements = [...array, array.length];
    setIdNumber((idNumber) => idNumber + 1);
    setArray(elements);
    const totals = [...elements, 0];
    setTotal(totals);
  };

  const remove = (index: number) => {
    const elements = [...array];
    elements.splice(index, 1);
    setArray(elements);
    const totals = [...elements];
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
      const name: HTMLInputElement = namesRef.current[index];
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
      body: { token: tokenAddress as `0x${string}`, payments: json },
    });
  };

  //
  return (
    <div className="w-full">
      <div className="flex flex-row border drop-shadow-md border-slate-900 rounded">
        <div className="w-24">
          <select
            id="selectInput"
            className="border text-gray-900 text-sm rounded-l focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleChange}
          >
            {options}
          </select>
        </div>
        <input
          id="tokenAddress"
          type="text"
          value={tokenAddress}
          className="border  rounded-r w-full"
          onChange={(event) => setTokenAddress(event.target.value)}
        />
      </div>

      <form id="formId" onSubmit={handleSubmit}>
        {array.map((_, index) => {
          return (
            <div
              className="my-4 border rounded-lg flex flex-col shadow-md"
              key={index}
            >
              <div className="flex justify-between items-center">
                <span className="px-2">
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
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </span>
                <button
                  id={`remove${index}`}
                  className="bg-red-500 text-white px-2 py-1 rounded m-1"
                  onClick={() => remove(index)}
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
              <div className="flex flex-row items-cente">
                <label className={`${labelCss} rounded-tl-lg`}>Address </label>
                <input
                  className={`${inputCss} rounded-tr-lg`}
                  id={`address${index}`}
                  ref={addAddressRef}
                  type="text"
                />
              </div>
              <div className="flex flex-row items-center">
                <label className={`${labelCss}`}>Name </label>
                <input
                  className={`${inputCss} `}
                  id={`name${index}`}
                  ref={addNameRef}
                  type="text"
                />
              </div>
              <div className="flex flex-row items-center">
                <label className={`${labelCss}`}>Notes </label>
                <input
                  className={`${inputCss}`}
                  id={`notes${index}`}
                  ref={addNotesRef}
                  type="text"
                />
              </div>
              <div className="flex flex-row items-center">
                <label className={`${labelCss}`}>Quantity </label>
                <input
                  className={`${inputCss}`}
                  ref={addQuantitiesRef}
                  type="text"
                  id={`quantity${index}`}
                  onChange={() => {
                    const quantity: HTMLInputElement =
                      quantitiesRef.current[index];
                    const amount: HTMLInputElement = amountsRef.current[index];
                    totalRef.current[index] = quantity.value * amount.value;
                  }}
                />
              </div>
              <div className="flex flex-row items-center">
                <label className={`${labelCss}`}>Amount </label>
                <input
                  className={`${inputCss}`}
                  ref={addAmountsRef}
                  type="text"
                  id={`amount${index}`}
                  onChange={() => {
                    const quantity: HTMLInputElement =
                      quantitiesRef.current[index];
                    const amount: HTMLInputElement = amountsRef.current[index];
                    totalRef.current[index] = quantity.value * amount.value;
                  }}
                />
              </div>
            </div>
          );
        })}
        <Button
          id="addElement"
          onClick={addElement}
          type="button"
          text="Add more"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Button>
        {/* <table className="w-full bg-slate-600  rounded ">
          <thead className="text-slate-50 text-left w-full ">
            <tr>
              <th className="px-2">Total: {total}</th>
            </tr>
          </thead>
          <tbody className="w-full">
            <tr>
              <td></td>
            </tr>
          </tbody>
        </table> */}
       
        <Button id="upload" type="submit" text="Generate id">
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
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        </Button>
        <hr className="m-2"/>
      </form>

      {uploadData && <Upload datas={uploadData} />}
      {uploadData?.name && (
        <>
          <div className="flex justify-center items-center">
            <h1 id="idText" className="text-2xl">
              ID: {uploadData.name}
            </h1>
            <CopyToClipboard text={uploadData.name}>
              <Button id="clipboard" type="button" text="Copy to clipboard">
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
                    d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                  />
                </svg>
              </Button>
            </CopyToClipboard>
          </div>
          <QRCodeSVG
            size={window.innerWidth - window.innerWidth * 0.1}
            value={uploadData.name}
          />
          <hr />
        </>
      )}
    </div>
  );
};
