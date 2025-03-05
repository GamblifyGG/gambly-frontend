import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMotionValue } from "framer-motion";
import { CardPattern, generateRandomString } from "@/components/ui/evaluate-card";
import convertNetworkToImage from "@/utils/convertNetworkToImage";
import { cn } from "@/utils/cn";

export function NetworkBox({ network, className }) {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
      let str = generateRandomString(1500);
      setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
      const str = generateRandomString(1500);
      setRandomString(str);
  }

  return (
    <div
      onMouseLeave={() => setHovering(false) }
      onMouseEnter={() => setHovering(true) }
      onClick={() => router.push(`/casinos/${network?.name}`) }
      className="border mt-4 hover:border-4 lg:h-64 cursor-pointer transition-all rounded-3xl bg-darkgray border-bordergray flex items-center justify-center w-full max-w-64 mx-auto p-1 lg:p-2 relative h-auto"
    >
      <div
        className={cn(
            "p-0.5  bg-transparent aspect-square  flex items-center justify-center w-full h-full relative",
            className
        )}
      >
        <div
          onMouseMove={onMouseMove}
          className="group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
        >
          <CardPattern
            mouseX={mouseX}
            mouseY={mouseY}
            randomString={randomString}
          />
          <div className="w-full relative z-10 h-full flex items-center justify-center">
            <div className="relative gap-2 h-full flex-col w-full rounded-full flex items-center justify-center text-white font-bold text-4xl">
              <div>
                  <img
                      src={convertNetworkToImage(network?.id)}
                      alt={network?.name}
                      className={`w-8 h-8 sm:w-16 sm:h-16 rounded-full transition-all duration-300 ease-in-out ${hovering === true ? "w-20 h-20" : ""}`}
                  />
              </div>
              <span className="capitalize text-white z-20 text-sm sm:text-xl ">{network?.name}</span>
            </div>
          </div>
        </div>
      </div >
    </div>
  );
}
