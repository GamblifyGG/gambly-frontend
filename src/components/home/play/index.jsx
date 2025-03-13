"use client";

import Button from "@/components/basic/button";
import { useLayoutEffect, useRef } from "react";
import { fadeInUp } from "@/animations/headline";
import ImageGallery from "./gallery";


const PlaySection = ({ isLive }) => {
  const playContentRef = useRef(null);

  useLayoutEffect(() => {
    if (playContentRef.current) {
      fadeInUp(playContentRef.current, true);
    }
  }, []);

  return (
    <section className="play-section flex justify-center mb-32 p-2 px-6 lg:px-24">
      <div className="flex w-full max-w-container items-center justify-between gap-3 flex-col md:flex-row">
        <ImageGallery />
        <div
          ref={playContentRef}
          className="flex flex-col p-2 items-center md:items-start text-white max-w-[640px] order-1 mb-10 md:mb-0 md:order-2"
        >
          <h1 className="font-bold mb-5 text-3xl text-center md:text-left lg:text-6xl md:text-5xl sm:text-3xl">
            Play Top Casino Games
          </h1>
          <p className="mb-5 text-center md:text-left">
            Master the art of poker and the excitement of coinflip with $WETH,
            the ultimate token for enthusiasts seeking a superior gaming
            experience.
          </p>
          <Button href={isLive ? "/casinos" : "/ "}>{isLive ? "Play Now" : "Coming Soon"}</Button>
        </div>
      </div>
    </section>
  );
};

export default PlaySection;
