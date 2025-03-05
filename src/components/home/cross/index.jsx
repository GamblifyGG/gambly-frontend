"use client";

import { useLayoutEffect, useRef } from "react";
import { fadeInUp } from "@/animations/headline";
import BlockchainLogos from "./logos";
import CrossSectionContent from "./content";
import CrossSectionImage from "./image";


export default function CrossSection() {
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      fadeInUp(contentRef.current, true);
    }
  }, []);

  return (
    <section className="flex justify-center mb-32 lg:px-24">
      <div className="flex justify-between flex-col md:flex-row items-center gap-20">
        <div ref={contentRef} className="flex flex-col gap-10 md:flex-row px-6 lg:px-0">
          <CrossSectionContent />
          {/* <div className="hidden md:block">
            <BlockchainLogos />
          </div> */}
        </div>
        <CrossSectionImage />
      </div>
    </section>
  );
}
