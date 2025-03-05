"use client";

import { fadeInUp } from "@/animations/headline";
import { faqData } from "@/data";
import { Accordion } from "@szhsin/react-accordion";
import { useLayoutEffect, useRef } from "react";
import FAQHeader from "./header";
import FAQItem from "./item";

const FAQSection = () => {
  const itemRef = useRef(null);

  useLayoutEffect(() => {
    if (itemRef.current) {
      fadeInUp(itemRef.current, true);
    }
  }, []);

  return (
    <section className="text-white flex justify-center mb-32 p-2 lg:px-24">
      <div className="w-full max-w-container flex justify-between flex-col md:flex-row">
        <FAQHeader />
        <Accordion
          className="flex flex-col gap-5 w-full max-w-[850px]"
          transition
          allowMultiple
          ref={itemRef}
        >
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
