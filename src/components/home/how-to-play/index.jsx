"use client";

import React, { useState, useLayoutEffect, useRef } from "react";
import { steps } from "@/data";
import { fadeInUp, scaleIn } from "@/animations/headline";
import Instructions from "./instruction";
import CarouselSection from "./carousel";
import NavigationButtons from "./navigation";
import BackgroundEffect from "./background";


const HowToPlaySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const instructionsRef = useRef(null);

  const increaseIndex = () => {
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const decreaseIndex = () => {
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  useLayoutEffect(() => {
    const instructions = instructionsRef.current;

    if (instructions) {
      fadeInUp(instructions, true);
    }
  
  }, []);

  return (
    <section className="mb-32 relative justify-center max-w-full p-2 lg:px-24 hidden md:flex">
      <div className="flex relative z-20 items-start bg-card rounded-xl p-10 justify-between w-full max-w-container gap-5">
        <div className="flex flex-col" ref={instructionsRef}>
          <Instructions currentIndex={currentIndex} />
          <NavigationButtons
            onIncrease={increaseIndex}
            onDecrease={decreaseIndex}
          />
        </div>
        <CarouselSection currentIndex={currentIndex} />
      </div>
      <BackgroundEffect />
    </section>
  );
};

export default HowToPlaySection;
