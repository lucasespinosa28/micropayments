import { ProvidersLocal } from "./providersLocal";
//import { ProviderMainnet } from "./providersMainnet";

export default function Provider({ children }: { children: React.ReactNode }) {
//   return <ProviderMainnet>{children}</ProviderMainnet>;
  return <ProvidersLocal>{children}</ProvidersLocal>;
}
