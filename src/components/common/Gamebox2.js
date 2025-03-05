import React, { useState } from "react";
import { EvervaultCard, Icon } from "@/components/ui/evaluate-card";
import { useRouter } from "next/router";

export function GameBox2({ tokenAddress, tokenSymbol, logo, network, className, token }) {

  const router = useRouter();

  const [hovering, setHovering] = useState(false);
  return (
    <div onMouseLeave={() => {
      setHovering(false);
    }} onMouseEnter={() => {
      setHovering(true);
    }}

      onClick={() => {
        router.push(`/casinos/${token.network.name.toLowerCase()}/${token.address}`);
      }}
      className={`border hover:border-4 cursor-pointer transition-all rounded-3xl  bg-darkgray border-bordergray flex items-center justify-center w-full relative h-auto ${className}`}>
      {/* <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" /> */}
      <EvervaultCard token={token} hovering={hovering} className={'text-darkgray'} />
    </div>
  );
}