import React, { useEffect, useState } from "react";
import { Nav } from "../../components";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { Player, usePlaybackInfo } from "@livepeer/react";
import axios from "axios";
import { ethers } from "ethers";
import { chains } from "../../constants";
import { Requirement, TokenInfo } from "../../types";

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
      const canWatch = await hasSufficientTokenBalance(token);
      const hasAccess = canWatch && hasWalletAccess(requiredUserAddress);
      setAccessStatus(hasAccess);
      if (hasAccess) {
        await generateJwt(requirement);
      }
    } else {
      if (Object.keys(token).length > 0) {
        const canWatch = await hasSufficientTokenBalance(token);
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
    const { data } = await axios.post("/api/generate-jwt", {
      requirement,
      userAddress,
    });

    if (data?.token) {
      setJwt(data.token);
      setAccessStatus(true);
    }
  };

  const hasSufficientTokenBalance = async (tokenInfo: TokenInfo) => {
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

    console.log(userAddress);

    const chain = chains.find((chain) => chain.name === tokenInfo.chain);

    if (!chain) {
      console.log("Chain mapping not found for chain:", tokenInfo.chain);
      return false;
    }

    const provider = new ethers.providers.JsonRpcProvider(chain.rpc);
    const contract = new ethers.Contract(
      tokenInfo.tokenAddress,
      minABI,
      provider
    );

    const result = await contract.balanceOf(userAddress);

    const balance = parseInt(ethers.utils.formatEther(result)); // // Assuming token has 18 decimal places

    const requiredToken = parseInt(tokenInfo.tokenAmount);

    return balance >= requiredToken;
  };

  const hasWalletAccess = (address: string) => address === userAddress;

  useEffect(() => {
    if (playbackInfo) {
      const { playbackPolicy } = playbackInfo?.meta ?? {};
      checkAccess(playbackPolicy as PlaybackPolicy); // Add 'as PlaybackPolicy' to assert the type
    }
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
