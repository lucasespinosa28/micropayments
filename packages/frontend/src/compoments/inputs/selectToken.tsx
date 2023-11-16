import { useState } from "react";

export const SelectToken = ({
  tokenRef,
}: {
  tokenRef: React.MutableRefObject<`0x${string}`>;
}) => {
  const tokens = [
    "0x471EcE3750Da237f93B8E339c536989b8978a438",
    "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  ];
  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>(
    "0x471EcE3750Da237f93B8E339c536989b8978a438",
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const token = tokens[parseInt(event.target.value)] as `0x${string}`;
    setTokenAddress(token);
    tokenRef.current = token;
  };

  const options = ["Celo", "cUSD"].map((item, index) => (
    <option key={`${item}-${index}`} value={index}>
      {item}
    </option>
  ));
  return (
    <div className="flex flex-row m-2 rounded">
      <select
        className="bg-sky-500 text-white pl-1 py-2 border-sky-500 border rounded-l"
        onChange={handleChange}
      >
        {options}
      </select>
      <input
        className="border border-sky-500 px-1 rounded-r"
        type="text"
        value={tokenAddress}
        onChange={(event) =>
          setTokenAddress(event.target.value as `0x${string}`)
        }
      />
    </div>
  );
};
