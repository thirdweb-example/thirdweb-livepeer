import React, { useMemo, useRef, useState } from "react";
import { Button, Input } from "./index";
import Select from "./Select";
import { useAsset, useCreateAsset } from "@livepeer/react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface ModalProps {
  onClose: () => void;
}

const Modal = ({ onClose }: ModalProps) => {
  const [chain, setChain] = useState<string>("ethereum");
  const [tokenAddress, setTokenAddress] = useState<string>();
  const [tokenAmount, setTokenAmount] = useState<string>();
  const [userAddress, setWalletAddress] = useState<string>();
  const [file, setFile] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    mutate: createAsset,
    data: createdAsset,
    status: createStatus,
    progress,
  } = useCreateAsset(
    file
      ? {
          sources: [
            {
              file: file,
              name: file.name,
              playbackPolicy: {
                type: "webhook",
                webhookId: process.env.NEXT_PUBLIC_WEBHOOK_ID as string,
                webhookContext: {
                  requirement: {
                    token: {
                      chain,
                      tokenAddress,
                      tokenAmount,
                    },
                    userAddress,
                  },
                },
              },
            },
          ] as const,
        }
      : null
  );

  const { data: asset, status: assetStatus } = useAsset({
    assetId: createdAsset?.[0]?.id,
    refetchInterval: (asset) =>
      asset?.storage?.status?.phase !== "ready" ? 2000 : false,
  });

  const progressFormatted = useMemo(() => {
    if (progress?.[0]?.phase === "failed" || createStatus === "error") {
      return "Failed to upload video.";
    } else if (progress?.[0]?.phase === "waiting") {
      return "Waiting";
    } else if (progress?.[0]?.phase === "uploading") {
      return `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`;
    } else if (progress?.[0]?.phase === "processing") {
      return `Processing: ${Math.round(progress?.[0]?.progress * 100)}%`;
    }
    return null;
  }, [progress, createStatus]);

  const isLoading = useMemo(() => {
    return (
      createStatus === "loading" ||
      assetStatus === "loading" ||
      (asset && asset?.status?.phase !== "ready") ||
      (asset?.storage && asset?.storage?.status?.phase !== "ready")
    );
  }, [asset, assetStatus, createStatus]);

  const validateInputs = () => {
    const tokenAmountRegex = /^[1-9][0-9]*$/;

    if ((!chain || !tokenAddress || !tokenAmount) && !userAddress) {
      toast("Please fill in the token gating requirements", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#000",
        },
      });
      return false;
    }

    if (userAddress && !ethers.utils.isAddress(userAddress)) {
      toast("Invalid User Wallet Address", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#000",
        },
      });
      return false;
    }

    if (chain && tokenAddress && tokenAmount) {
      if (!ethers.utils.isAddress(tokenAddress)) {
        toast("Invalid Token Contract Address", {
          icon: "🔒",
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#000",
          },
        });
        return false;
      }

      if (!tokenAmountRegex.test(tokenAmount)) {
        toast("Invalid Token Amount. Please enter a valid positive integer", {
          icon: "🔒",
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#000",
          },
        });
        return false;
      }
    }

    if (!file) {
      toast("Please choose a video file to upload", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#000",
        },
      });
      return false;
    }

    return true;
  };

  const uploadVideo = () => {
    if (!validateInputs()) {
      return;
    }

    createAsset?.(); // Initiate the upload if all fields are valid
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 ">
        <div className="my-6 w-2/5 border-0 rounded-lg shadow-md relative flex flex-col bg-white p-6">
          <div className="flex flex-row justify-between">
            <h2 className="text-black font-sans text-xl mb-4 font-medium">
              Upload and token gate video
            </h2>
            <div onClick={onClose} className="hover:cursor-pointer">
              {closeIcon()}
            </div>
          </div>
          <div>
            <Select
              onChange={(e) => setChain(e.target.value)}
              label="Chain"
              placeholder="Please select chain"
            />
            <Input
              onChange={(e) => setTokenAddress(e.target.value)}
              label="Token Contract Address"
              placeholder="0x"
            />
            <Input
              onChange={(e) => setTokenAmount(e.target.value)}
              label="Token Amount"
              placeholder="20"
            />
            <p className="mt-2 mb-4 text-sm text-gray-500 text-center">
              and/or
            </p>
            <Input
              onChange={(e) => setWalletAddress(e.target.value)}
              label="User Wallet Address"
              placeholder="20"
            />
          </div>
          <div
            onClick={openFilePicker}
            className="w-full border-dashed border p-3 rounded mt-4 hover:border-gray-400 hover:cursor-pointer"
          >
            <p className="text-center text-gray-500">
              {file ? (
                file.name +
                " - " +
                Number(file.size / 1024 / 1024).toFixed() +
                " MB"
              ) : (
                <>Choose a video file to upload</>
              )}
            </p>
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              hidden
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>

          {asset?.status?.phase === "ready" ? (
            <p className="text-center mt-4 ">
              Your video is successfully uploaded! You can view it{" "}
              <span className="text-primary">
                <Link href={"/watch/" + asset.playbackId}>here</Link>
              </span>
            </p>
          ) : (
            <div className="flex items-center justify-center ml-10">
              <Button onClick={uploadVideo}>
                {isLoading ? progressFormatted || "Uploading..." : "Upload"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="opacity-20 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

const closeIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.24261 0.757377L0.757324 9.24266M9.24261 9.24261L0.757324 0.757324"
      stroke="#222"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Modal;
