"use client";
import { stringToHex } from "viem";
import { Payments } from "../../../app/Payments";

export default function Home({ params }: { params: { slug: string } }) {
  const address = window.localStorage.getItem("address");
  return (
    <div>
      {address && (
        <Payments
          key={params.slug}
          id={stringToHex(params.slug, { size: 32 })}
          address={address as `0x${string}`}
        />
      )}
    </div>
  );
}
