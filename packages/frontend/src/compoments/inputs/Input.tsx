"use client";
import React, { ChangeEventHandler } from "react";
import { Type } from "../../app/create/InputCreator";

export const Input = ({
  id,
  type,
  value,
  onChange,
  children,
}: {
  id: string;
  type: Type;
  index: number;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  children: JSX.Element;
}) => {
  return (
    <>
      <span className="h-2" />
      <div>
        <label className="text-white bg-sky-500 rounded border-sky-500 p-1 ml-2">
          {children}
        </label>
      </div>
      <input
        id={id}
        type={type}
        className="border px-1 mx-1 rounded border-sky-500 "
        value={value}
        onChange={onChange}
      />
    </>
  );
};
