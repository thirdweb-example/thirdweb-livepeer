import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";

const Nav = () => {
  return (
    <header className="relative py-4 md:py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          <div className="flex-shrink-0">
            <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">
              <Link
                href="#"
                className="text-base font-medium text-slate-600 transition-all duration-200 hover:text-purple-600 focus:text-purple-600"
              >
                thirdweb docs
              </Link>
              <Link
                href="#"
                className="text-base font-medium text-slate-600 transition-all duration-200 hover:text-purple-600 focus:text-purple-600"
              >
                Livepeer docs
              </Link>

              <Link
                href="#"
                className="text-base font-medium text-slate-600 transition-all duration-200 hover:text-purple-600 focus:text-purple-600"
              >
                GitHub repo
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
            <ConnectWallet theme="light" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
