import { abi } from "../../Invoice.json";
import { useContractRead } from "wagmi";
import { AlertError, AlertLoading } from "../statics/alert";
import { formatUnits } from "viem";
import { Dispatch, SetStateAction, useEffect } from "react";

export const PaymentBalance = ({
  id,
  index,
  decimals,
  setBalance,
}: {
  id: `0x${string}`;
  index: number;
  decimals: number;
  setBalance: Dispatch<SetStateAction<bigint>>;
}) => {
  const { data, isLoading, isSuccess, isFetching, error } = useContractRead({
    address: "0x154b7a820f08729AEE849620aE058EF8d3CE967f",
    abi: abi,
    functionName: "getPaymentBalance",
    args: [id, BigInt(index)],
    watch: true,
  });
  useEffect(() => {
    if(data){
      setBalance(data as bigint);
    }
  },[data]);
  return (
    <>
      {isSuccess && data && (
        <p>Payment Balance{formatUnits(data as bigint, decimals)}</p>
      )}
      {isLoading && isFetching && (
        <AlertLoading>
          <>Loading...</>
        </AlertLoading>
      )}
      {error && <AlertError error={error} />}
    </>
  );
};

// bytes32 id,
//         uint256 index

// export const SendPayment = ({
//   id,
//   index,
// }: {
//   id: `0x${string}`;
//   index: number;
// }) => {
//   const [isDisplayed, setDisplayed] = useState<boolean>(false);
//   const { reload, setReload } = useContext(reloading);

//   const { data, isLoading, isSuccess, write, error } = useContractWrite({
//     address: contract.invoice as `0x${string}`,
//     abi: abi,
//     functionName: "sendPayment",
//     args: [id, BigInt(index)],
//     onSuccess() {
//       setDisplayed(true);
//       if(setReload){
//         setReload(!reload);
//       }
//     },
//     onError(error) {
//       console.error(error);
//     },
//   });
//   if (error) {
//     console.error(error);
//   }
//   return (
//     <>
//       <ButtonPrimary
//         id={"approve" + index}
//         onClick={() => write?.()}
//         disabled={isDisplayed}
//       >
//         <>Deposit tokens</>
//       </ButtonPrimary>
//       {isSuccess && data && <WaitForTransaction hash={data.hash} />}
//       {isLoading && (
//         <AlertLoading>
//           <>Loading...</>
//         </AlertLoading>
//       )}
//       {error && <AlertError error={error} />}
//     </>
//   );
// };
