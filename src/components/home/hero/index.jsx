"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import Rewards from "@/components/basic/icons/rewards";
import { scaleIn } from "@/animations/headline";
import HeadlineSection from "./headline";
import StatsSection from "./stats";
import mainImage from "@/assets/home-main-image.png"
export default function HeroSection() {
  const imageRef = useRef(null);

  useLayoutEffect(() => {
    if (imageRef.current) {
      scaleIn(imageRef.current, false);
    }
  }, []);

  return (
    <section className="flex justify-center px-6 lg:px-24 p-2 mb-32">
      <div className="w-full max-w-container flex items-center justify-between">
        <div className="flex flex-col">
          <HeadlineSection />
          <StatsSection />
        </div>
        <div
          ref={imageRef}
          className="max-w-[740px] min-w-[320px] w-full h-auto hidden md:flex"
        >
          <Image
            src={mainImage}
            width={1000}
            height={1000}
            alt="casino"
          />
        </div>
      </div>
      <div className="bg-primary rounded-full p-5 fixed bottom-[100px] right-[30px] z-50 shadow-2xl shadow-primary">
        <Rewards />
      </div>
    </section>
  );
}

