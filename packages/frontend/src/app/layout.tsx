"use client";
import { Inter } from "next/font/google";
import "./globals.css";
// import Provider from "@/compoments/web3/providers";
import ProviderMainnet from "@/compoments/web3/providersMainnet";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProviderMainnet>{children}</ProviderMainnet>
        {/* <Provider>{children}</Provider> */}
      </body>
    </html>
  );
}