"use client";

import { fadeInUp } from "@/animations/headline";
import { useLayoutEffect, useRef } from "react";

const FAQHeader = () => {

  const headerRef = useRef(null);

  useLayoutEffect(() => {
    if (headerRef.current) {
      fadeInUp(headerRef.current, true);
    }
  }, []);

  return (
    <div ref={headerRef} className="flex flex-col p-2 items-center md:items-start text-white max-w-[640px]">
      <h1 className="faq-header font-bold mb-5 text-3xl text-center md:text-left lg:text-6xl md:text-5xl sm:text-3xl">
        FAQ
      </h1>
      <p className="mb-5 text-center md:text-left">Got some questions?</p>
    </div>
  );
};

export default FAQHeader;
