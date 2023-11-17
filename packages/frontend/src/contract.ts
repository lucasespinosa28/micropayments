import { isDevEnvironment } from "./isDeveloper";
import { payments } from "../../contract/local.json";

export const paymentsContract: `0x${string}` = isDevEnvironment ? payments as `0x${string}` : "0x154b7a820f08729AEE849620aE058EF8d3CE967f";