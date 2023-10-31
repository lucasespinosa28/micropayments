"use client";
import { Update } from '@/app/invoice/update'
import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react'
import { useAccount } from 'wagmi';

const Address = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  if (isConnecting) return <div>Connecting…</div>
  if (isDisconnected) return <div>Disconnected</div>
  return <div>{address}</div>
}

export default function Home() {
 
  let message = "production";
  const env = process.env.NODE_ENV
  if(env == "development"){
    message = "dev"
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{message}</h1>
      <Address />
      <Link id="historic" href="/historic">historic</Link>
      <Link id="invoice" href="/invoice">invoice</Link>
      <Link id="payment" href="/payment">payment</Link>
    </main>
  )
}
