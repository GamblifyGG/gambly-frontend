"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { scaleIn } from "@/animations/headline";
import LiveBettingInfo from "./information";
import pokerPreview from "@/assets/poker-preview.png"

const LiveSection = ({ isLive }) => {
  const title = "Live Betting Casinos";
  const description =
    "Challenge your friends or other players in the game of poker, coin flip and rock, paper scissors using top tokens and wins amazing bets.";
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    const element = imageRef.current;

    if (element) {
      scaleIn(element, true);
    }
  }, []);

  return (
    <section className="flex justify-center p-2 mb-32 px-6 lg:px-24">
      <div className="w-full max-w-container flex items-center justify-between flex-col md:flex-row">
        <LiveBettingInfo isLive={isLive} title={title} description={description} />
        <div
          ref={imageRef}
          className="max-w-[740px] min-w-[320px] w-full h-auto"
        >
          <Image
            src={pokerPreview}
            width={740}
            height={740}
            alt="casino"
          />
        </div>
      </div>
    </section>
  );
};

export default LiveSection;
