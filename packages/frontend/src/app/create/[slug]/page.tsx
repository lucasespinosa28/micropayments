"use client";
import { stringToHex } from "viem";
import { Payments } from "../../../app/Payments";
import { Menu } from "@/compoments/statics/menu";
import { useAccount } from "wagmi";

export default function Home({ params }: { params: { slug: string } }) {
  const { address } = useAccount();
  console.log({address});
  return (
    <main>
      <Menu />
      {address && (
        <>
        <p>payment</p>
         <Payments
          key={params.slug}
          id={stringToHex(params.slug, { size: 32 })}
          address={address as `0x${string}`}
        />
        </>
       
      )}
    </main>
  );
}
