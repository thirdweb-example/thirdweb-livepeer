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
  walletConnectV1,
  walletConnect,
  safeWallet,
  paperWallet,
} from "@thirdweb-dev/react";

const client = createReactClient({
  provider: studioProvider({ apiKey: "9e8e8a41-24c3-42ec-9b7e-bc3739177068" }),
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
