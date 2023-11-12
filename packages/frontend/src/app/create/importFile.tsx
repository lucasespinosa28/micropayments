import { useState } from "react";
import { InputValues } from "./InputValues";
import { InputCreator } from "./InputCreator";

export const ImportFile = ({
  setData,
  setAction,
}: {
  setData: React.Dispatch<React.SetStateAction<InputValues[]>>;
  setAction: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // const [isAction,setAction] = useState<number>(0);
  // const [data, setData] = useState<InputValues[]>([]);
  return (
    <>
      <input
        type="file"
        onChange={async (e) => {
          if (e.target.files) {
            const file: File = e.target.files[0];
            const text = await file.text();
            const csv = text.split("\n");
            const Rows: InputValues[] = [];
            for (const items of csv) {
              const item = items.split(",");
              Rows.push({
                payer: item[2],
                amount: item[3],
                receiver: item[4],
                dateTime: item[1],
              });
            }
            Rows.shift();
            setData(Rows);
            setAction(1);
          }
        }}
      />
      {/* <button onClick={() => setAction(2)}>Create a new</button>
      {isAction == 1 && <InputCreator inputValues={data} />}
      {isAction == 2 && <InputCreator inputValues={[]} />} */}
    </>
  );
};
