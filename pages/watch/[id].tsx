import React, { useEffect, useState } from "react";
import { Nav } from "../../components";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { Player, usePlaybackInfo } from "@livepeer/react";
import { ethers } from "ethers";
import { supporttedChains } from "../../constants";
import { Requirement, TokenInfo } from "../../types";
import { type Address, ThirdwebSDK, toEther } from "@thirdweb-dev/sdk";

interface PlaybackPolicy {
  webhookContext: {
    requirement: Requirement;
  };
}

const Watch: React.FC = () => {
  const userAddress = useAddress();
  const [accessStatus, setAccessStatus] = useState<string | boolean>(
    "checking"
  );
  const [jwt, setJwt] = useState<string>("");

  const router = useRouter();
  const playbackId = router.query.id?.toString();

  const { data: playbackInfo } = usePlaybackInfo({
    playbackId,
  });

  const checkAccess = async (playbackPolicy: PlaybackPolicy) => {
    if (!userAddress) {
      return;
    }

    const { requirement } = playbackPolicy.webhookContext;
    const { token, userAddress: requiredUserAddress } = requirement;

    const hasTokenAndUser =
      Object.keys(token).length > 0 && requiredUserAddress;

    if (hasTokenAndUser) {
      const canWatch = await hasSufficientTokenBalance(token, userAddress); // Check this
      const hasAccess = canWatch && hasWalletAccess(requiredUserAddress);
      setAccessStatus(hasAccess);
      if (hasAccess) {
        await generateJwt(requirement);
      }
    } else {
      if (Object.keys(token).length > 0) {
        const canWatch = await hasSufficientTokenBalance(token, userAddress);
        setAccessStatus(canWatch);
        if (canWatch) {
          await generateJwt(requirement);
        }
      }

      if (requiredUserAddress) {
        const canWatch = hasWalletAccess(requiredUserAddress);
        setAccessStatus(canWatch);
        if (canWatch) {
          await generateJwt(requirement);
        }
      }
    }
  };

  const generateJwt = async (requirement: Requirement) => {
    const response = await fetch("/api/generate-jwt", {
      method: "POST",
      body: JSON.stringify({ requirement, userAddress }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data?.token) {
      setJwt(data.token);
      setAccessStatus(true);
    }
  };

  const hasSufficientTokenBalance = async (
    tokenInfo: TokenInfo,
    address: Address
  ) => {
    const chain = supporttedChains.find(
      (chain) => chain.name === tokenInfo.chain
    );

    if (!chain) {
      console.log("Chain ", tokenInfo.chain, " not supported");
      return false;
    }

    const sdk = new ThirdwebSDK(chain);

    const minABI = [
      // balanceOf
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ];

    const contract = await sdk.getContract(
      tokenInfo.tokenAddress, // The address of your smart contract
      minABI // The ABI of your smart contract
    );

    const result = await contract.erc20.balanceOf(address);

    const balance = parseInt(toEther(result.value)); // // Assuming token has 18 decimal places

    const requiredToken = parseInt(tokenInfo.tokenAmount);

    return balance >= requiredToken;
  };

  const hasWalletAccess = (address: string) => address === userAddress;

  useEffect(() => {
    if (playbackInfo) {
      const { playbackPolicy } = playbackInfo?.meta ?? {};
      checkAccess(playbackPolicy as PlaybackPolicy); // Add 'as PlaybackPolicy' to assert the type
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackInfo, userAddress, playbackId]);

  return (
    <div className="overflow-x-hidden bg-[url(/images/bg.png)] bg-cover h-screen">
      <Nav />
      <section className="relative py-12 sm:py-16 lg:pt-20 xl:pb-0">
        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-flex px-4 py-2 text-base text-gray-900 border border-gray-300 rounded-full font-pj">
              Livepeer x thirdweb app
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">
              Watch video
            </h1>
            <p className="max-w-md mx-auto mt-6 text-base leading-7 text-gray-600 font-inter">
              {!userAddress && "Please connect your wallet to continue"}
              {accessStatus === false &&
                "Sorry, you don't have access to this video"}
            </p>
            {jwt && <Player playbackId={playbackId} accessKey={jwt} />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Watch;
