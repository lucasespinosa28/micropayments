const style = (type: "success" | "error" ): string => {
  return type == "success"
    ? "bg-green-100 border border-green-400 text-green-700"
    : "bg-red-100 border border-red-400 text-red-700";
};

export function AlertTranscation({
  message,
  type,
  hash,
}: {
  message: string;
  type: "success" | "error";
  hash?: `0x${string}`;
}): JSX.Element {
  const  Alert = () => {
    switch (type) {
      case "success":
        return (<h1>success!</h1>)
        case "error":
        return (<h1>error!</h1>)
    }  
  }
  return (<Alert/>)
}

const SuccessAlert = () => {
  return (
    <a
      className={`flex justify-between items-center ${style(type)} px-4 rounded shadow-md`}
      role="alert"
      href={`https://explorer.celo.org/mainnet/tx/${hash}`}
      target="_blank"
    >
      <strong className="font-bold">{message}!</strong>
      <span className="px-4 py-3">
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
            d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
          />
        </svg>
      </span>
    </a>
  );
}