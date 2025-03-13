"use client";

import { fadeInUp } from "@/animations/headline";
import Button from "@/components/basic/button";
import { useLayoutEffect, useRef } from "react";

const HeadlineSection = ({ isLive }) => {
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const tagRef = useRef(null);

  useLayoutEffect(() => {
    if (tagRef.current) {
      fadeInUp(tagRef.current, false, 0);
    }
    if (headingRef.current) {
      fadeInUp(headingRef.current, false, 0.3);
    }
    if (contentRef.current) {
      fadeInUp(contentRef.current, false, 0.6);
    }
    if (buttonRef.current) {
      fadeInUp(buttonRef.current, false, .9);
    }
  }, []);

  return (
    <div className="relative flex flex-col items-start mb-10 max-w-[590px]">
      <div
        ref={tagRef}
        className="z-10 text-primary bg-primaryTag border p-2 rounded-lg border-primary mb-5"
      >
        Welcome to Gambly
      </div>
      <h1
        ref={headingRef}
        className="z-10 text-white font-bold mb-5 text-3xl lg:text-6xl md:text-5xl sm:text-3xl"
      >
        Find and Join Your Community 🚀Personal Casino
      </h1>
      <p ref={contentRef} className="z-10 text-white mb-5">
        Gambly introduces a pioneering cross-chain casino platform, the first of
        its kind, where you can enjoy gaming with any ERC20, BSC20 or Solana (SPL) token. Discover the
        casino tailored for your community and embark on your gaming journey
        today.
      </p>
      <Button href={isLive ? "/casinos" : "/ "} buttonRef={buttonRef} className="z-10 hover:animate-pulse transition-all">
        {isLive ? "Browse Casinos" : "Coming Soon"}
      </Button>
      <div className="absolute right-10 w-full max-w-[250px] h-full max-h-[250px] blur-2xl opacity-30 rounded-full z-0 bg-primary" />
    </div>
  );
};

export default HeadlineSection;