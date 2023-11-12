import { useState } from "react";
import contract from "../../../../../packages/contract/address.json";
export const SelectToken = (
    {tokenRef}:{tokenRef:React.MutableRefObject<`0x${string}`>}
) => {
    const tokens = [
        contract.token,
        "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
        "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
        "0xE4D517785D091D3c54818832dB6094bcc2744545",
      ];
      const [tokenAddress, setTokenAddress] = useState<`0x${string}`>(
        contract.token as `0x${string}`
      );
    
      const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const token = tokens[parseInt(event.target.value)] as `0x${string}`
        setTokenAddress(token);
        tokenRef.current = token;
      };
    
      let options = ["Celo", "cUSD", "cEUR", "cREAL"].map(
        (item, index) => (
          <option key={`${item}-${index}`} value={index}>
            {item}
          </option>
        )
      );
  return (
    <div>
      <div>
        <select
          onChange={handleChange}
        >
          {options}
        </select>
      </div>
      <input
        type="text"
        value={tokenAddress}
        onChange={(event) => setTokenAddress(event.target.value as `0x${string}`)}
      />
    </div>
  );
};
