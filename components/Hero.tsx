import React, { useState } from "react";
import Nav from "./Nav";
import { Button, Modal } from "./shared";
import { useWallet } from "@thirdweb-dev/react";
import { toast } from "react-hot-toast";

const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const wallet = useWallet();

  const toggleModal = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const handleWalletCheck = () => {
    if (wallet) {
      toggleModal();
    } else {
      toast("Please connect your wallet", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#000",
        },
      });
    }
  };

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
              Token gate your videos using Livepeer and thirdweb
            </h1>
            <p className="max-w-md mx-auto mt-6 text-base leading-7 text-gray-600 font-inter">
              A demo application that demonstrates how to use Livepeer to token
              gate videos with thirdweb.
            </p>
            <Button onClick={handleWalletCheck} className="px-8 py-4 text-lg">
              Upload a video
            </Button>
          </div>
        </div>
      </section>
      {isModalOpen && <Modal onClose={toggleModal} />}
    </div>
  );
};

export default Hero;
