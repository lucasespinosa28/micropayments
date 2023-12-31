"use client";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { FindPayment } from "../compoments/inputs/findPayment";
import { History } from "./History";
import { Menu } from "../compoments/statics/menu";
import { AlertWarning, AlertLoading } from "@/compoments/statics/alert";
import { ButtonSecondary } from "@/compoments/inputs/buttons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useEffect } from "react";
import { contract } from "../../src/contract";
import { isDevEnvironment } from "@/isDeveloper";
export default function Home() {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if (!isDevEnvironment && window.ethereum && window.ethereum.isMiniPay) {
      connect();
    }
  }, []);

  return (
    <main className="flex flex-col">
      {<h1>{contract}</h1>}
      <Menu />
      {isConnecting && (
        <div>
          <AlertLoading>
            <>Loading...</>
          </AlertLoading>
        </div>
      )}
      {isDisconnected && (
        <div>
          <AlertWarning>
            <>Disconnected</>
          </AlertWarning>
          <ConnectButton />
        </div>
      )}
      {isConnected && address && (
        <div>
          <div className="flex justify-center w-screen ">
            <Link id="create" href="/create" className="m-4 w-screen">
              <ButtonSecondary id={"createButton"}>
                <div className="w-full flex justify-center">
                  <span className="px-2">Create payment list</span>
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
                      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                    />
                  </svg>
                </div>
              </ButtonSecondary>
            </Link>
          </div>
          <FindPayment address={address} />
          <hr />
          <h2 className="font-bold text-2xl text-center drop-shadow-md">
            Payment history
          </h2>
          <History address={address} />
        </div>
      )}
    </main>
  );
}
