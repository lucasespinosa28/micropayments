"use client";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Invoices } from "./Invoices";
export const contract = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting…</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Historic</h1>
      <Link id="back" href="/">
        Back
      </Link>
      <Invoices address={address} />
    </main>
  );
}
