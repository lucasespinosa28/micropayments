"use client";
import { Update } from '@/compoments/update'
import Image from 'next/image'
import Link from 'next/link';
import { useState } from 'react'

export default function Home() {
  let message = "production";
  const env = process.env.NODE_ENV
  if(env == "development"){
    message = "dev"
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{message}</h1>
      <Link href="/historic">historic</Link>
      <Link href="/invoice">invoice</Link>
      <Link href="/payment">payment</Link>
      {/* <Update/> */}
    </main>
  )
}
