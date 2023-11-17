"use client";
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [Celo, Alfajores],
  [publicProvider()]
);

const connectors = [new InjectedConnector({ chains })];

const appInfo = {
  appName: "Celo Composer",
};

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: publicClient,
});

export function ProviderMainnet({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} coolMode={true}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
