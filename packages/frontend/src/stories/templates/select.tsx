import { useRef } from "react";
import contracts from "../../../../contract/address.json";
import { SelectToken } from "../../compoments/inputs/selectToken";

export default function Template() {
  const tokenRef = useRef<`0x${string}`>(contracts.token as `0x${string}`);
  return <SelectToken tokenRef={tokenRef} />;
}
