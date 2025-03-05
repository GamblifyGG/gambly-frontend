"use client";

import First from "@/components/basic/icons/first";
import Second from "@/components/basic/icons/second";
import Third from "@/components/basic/icons/third";
import { useLayoutEffect, useRef } from "react";
import { fadeInUp } from "@/animations/headline";
import Step from "./step";
import preview1 from "@/assets/login-image.png"
import preview2 from "@/assets/casino-preview.png"
import preview3 from "@/assets/poker-preview.png"

const HowToPlayMdSection= () => {
  const stepsRef = useRef([]);

  useLayoutEffect(() => {
    // Register each step with GSAP ScrollTrigger
    stepsRef.current.forEach((step, index) => {
      if (step) {
        fadeInUp(step, true);
      }
    });
  }, []);

  // Function to set the ref for each Step item
  const setStepRef = (el) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  return (
    <section className="p-2 mb-32 px-6 flex md:hidden">
      <div className="bg-card rounded-xl p-5">
        <h1 className="font-bold text-primary text-3xl mb-10">How to play</h1>
        <div ref={setStepRef}>
          <Step
            image={preview1}
            Icon={First}
            title="Connect Wallet"
            description="Connect your wallet to the Gambly platform. You can use any wallet that supports ERC20 or Solana (SPL) tokens."
            ref={setStepRef}
          />
        </div>
        <div ref={setStepRef}>
          <Step
            image={preview2}
            Icon={Second}
            title="Deposit Tokens"
            description="Deposit any ERC20 or Solana (SPL) token to play our games. Your digital assets, whether mainstream or niche, are your ticket to our ultimate online gaming freedom."
            ref={setStepRef}
          />
        </div>
        <div ref={setStepRef}>
          <Step
            image={preview3}
            Icon={Third}
            title="Play!"
            description="Play our games with your digital assets. No need to worry about fiat currency, just play with your assets!"
            ref={setStepRef}
          />
        </div>
      </div>
    </section>
  );
};

export default HowToPlayMdSection;
