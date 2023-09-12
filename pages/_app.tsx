import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { Toaster } from "react-hot-toast";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
} from "@thirdweb-dev/react";
import { supporttedChains } from "../constants";

const client = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LP_KEY as string,
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        safeWallet(),
      ]}
      activeChain={supporttedChains[0]}
      supportedChains={supporttedChains}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string}
    >
      <LivepeerConfig client={client}>
        <Component {...pageProps} />
        <Toaster />
      </LivepeerConfig>
    </ThirdwebProvider>
  );
}
