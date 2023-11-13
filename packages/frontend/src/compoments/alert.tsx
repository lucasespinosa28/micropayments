import { useState } from "react";

export const AlertError = ({ error }: { error: Error; }) => {
  const [display, setDisplay] = useState<boolean>(true);
  let message: string[] = error.message.split(".");
  message = message[0].split(":");
  console.log(error);
  return (
    <>
      {display ? (
        <div className="bg-red-500 text-white m-3 p-1 rounded shadow-2xl">
          <div className="flex flex-row items-stretch m-1">
            <div>
              <p className="text-sm">
                {message[0].replace("confirm", "Receiver")}:
              </p>
              <p className="font-bold">{message[1]}.</p>
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
                  d="M6 18L18 6M6 6l12 12" />
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

export const AlertLoading = () => {
    return (
      <div className="flex flex-row justify-center bg-blue-500  text-white py-3 m-3 rounded shadow-2xl">
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
            stroke-width="3.55556"
            stroke-linecap="round" />
        </svg>
        <h3>Processing...</h3>
      </div>
    );
  };
  