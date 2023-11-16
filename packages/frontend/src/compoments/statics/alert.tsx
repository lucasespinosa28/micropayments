import { useState } from "react";
import { shortAddress } from "../shortAddress";

export const AlertTranscation = ({
  status,
  hash,
}: {
  status: "success" | "reverted";
  hash: `0x${string}`;
}) => {
  const color = status === "success" ? "bg-lime-500" : "bg-red-500";
  const [display, setDisplay] = useState<boolean>(true);
  return (
    <>
      {display ? (
        <div className={`${color} text-white m-3 p-1 rounded shadow-2xl`}>
          <div className="flex justify-between m-1">
            <a
              href={`https://explorer.celo.org/mainnet/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-row items-center">
                <p className="font-bold text-lg">{status}:</p>
                <p className="text-sm pt-1">{shortAddress(hash, 8)}</p>
              </div>
            </a>

            <svg
              onClick={() => setDisplay(false)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

interface Error {
  name: string;
  message: string;
  stack?: string;
}

export const AlertError = ({ error }: { error: Error }) => {
  const [display, setDisplay] = useState<boolean>(true);
  // let message: string[] = ["Unknown error", "!"];
  // console.log(error);
  // if (error.message.includes(".") && error.message.includes(":")) {
  //   message = error.message.split(".")[0].split(":");
  // }
  return (
    <>
      {display ? (
        <div className="bg-red-500 text-white m-3 p-1 rounded shadow-2xl">
          <div className="flex flex-row items-stretch m-1">
            <div>
              <p className="text-sm">
                {error.message}
              </p>
              {/* <p className="font-bold">{error.message}.</p> */}
            </div>
            <button className="self-center" onClick={() => setDisplay(false)}>
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export const AlertLoading = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-row justify-center bg-sky-500  text-white py-3 m-3 rounded shadow-2xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="animate-spin h-5 w-5  w-6 h-6"
      >
        <path
          d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"
          stroke="#ffff"
          strokeWidth="3.55556"
          strokeLinecap="round"
        />
      </svg>
      {children}
    </div>
  );
};

export const AlertWarning = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-row justify-center bg-amber-500  text-white py-3 m-3 rounded shadow-2xl">
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
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      {children}
    </div>
  );
};
