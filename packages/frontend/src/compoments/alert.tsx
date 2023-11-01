export function AlertSuccess({ message }: { message: string }): JSX.Element {
  return (
    <div
      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-md"
      role="alert"
    >
      <strong className="font-bold">{message}!</strong>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
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
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </span>
    </div>
  );
}

export function AlertInfo({ message }: { message: string }): JSX.Element {
  return (
    <div
      className="flex flex-row bg-blue-300 border border-blue-800 rounded text-blue-800 px-4 py-3 shadow-md"
      role="alert"
    >
      <strong className="font-bold">{message}!</strong>
      <span className="pl-2">
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
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </span>
    </div>
  );
}
