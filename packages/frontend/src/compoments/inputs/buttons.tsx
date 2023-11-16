import { MouseEventHandler } from "react";
interface ButtonProps {
  id: string;
  children: JSX.Element;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const style =
  "flex flex-row w-full my-1 text-white border font-bold py-2 px-2 rounded shadow-md disabled:opacity-25";

export const ButtonPrimary = ({
  id,
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={"bg-sky-500 border-sky-700" + style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ButtonSecondary = ({
  id,
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={"bg-lime-500 border-lime-700" + style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ButtonError = ({
  id,
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={"bg-red-500 border-red-700" + style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ButtonWarning = ({
  id,
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={"bg-amber-500 border-amber-700" + style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
