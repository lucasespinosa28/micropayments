"use client";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { localhost } from "wagmi/chains";
import { createWalletClient, http } from "viem";
import { MockConnector } from 'wagmi/connectors/mock'
import { privateKeyToAccount } from "viem/accounts";
const { publicClient, webSocketPublicClient } = configureChains(
  [localhost],
  [publicProvider()]
);

const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') 

const client = createWalletClient({
  account,
  chain: localhost,
  transport: http()
})

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MockConnector({
      options: {
        walletClient: client,
      },
    }),
    ]
});

export default function Provider({ children }: { children: React.ReactNode }) {
    return <WagmiConfig config={config}>{children}</WagmiConfig>
}
