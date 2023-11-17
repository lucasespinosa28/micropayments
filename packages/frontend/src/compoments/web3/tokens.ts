import { isDevEnvironment } from "@/isDeveloper";
import { token } from "../../../../contract/local.json";
export function tokens():{address:`0x${string}`[],symbol:string[]} {
    if (isDevEnvironment) {
        return { address: [token as `0x${string}`], symbol: ["cTest"] };
    }
    return  {address:["0x765DE816845861e75A25fCA122bb6898B8B1282a"],symbol:["cUSD"]};
    // return {address:["0x765DE816845861e75A25fCA122bb6898B8B1282a"],symbol:["cUSD"]}
}