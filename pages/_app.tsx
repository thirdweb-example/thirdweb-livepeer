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
      activeChain="ethereum"
    >
      <LivepeerConfig client={client}>
        <Component {...pageProps} />
        <Toaster />
      </LivepeerConfig>
    </ThirdwebProvider>
  );
}
