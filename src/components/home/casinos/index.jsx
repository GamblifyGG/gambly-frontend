"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import CasinoCard from "./card";
import { fadeInUp } from "@/animations/headline";
import { getCasinos } from '@/api'


export default function CasinosSection() {

  const testRef = useRef(null);
  const [casinos, setCasinos] = useState([])

  const fetchPopularCasinos = async () => {
    const [er, data] = await getCasinos({ limit: 9, sort: 'bets_total' })
    if (data) {
      console.log('[data]', data)
      setCasinos(data.casinos)
    }
  }

  useLayoutEffect(() => {
    const testElement = testRef.current;

    if(testElement) {
      fadeInUp(testElement, true);
    }
  }, []);

  useEffect(() => {
    fetchPopularCasinos()
  }, [])

  return (
    <section ref={testRef} className="relative flex justify-center mb-32 p-2 lg:px-24 px-6">
      <div className="flex relative z-20 flex-col w-full max-w-container items-center">
        <div className="flex flex-col p-2 items-center text-white max-w-[640px]">
          <h1
            className="font-bold mb-5 text-3xl text-center lg:text-6xl md:text-5xl sm:text-3xl"
          >
            Popular Casinos
          </h1>
          <p className="mb-5 text-center">
            Master the art of poker and the excitement of coinflip with the
            ultimate tokens for enthusiasts seeking a superior gaming
            experience.
          </p>
        </div>
        <div className="grid grid-cols-1 w-full gap-5 lg:gap-10 md:gap-5 lg:grid-cols-3 sm:grid-cols-2 ">
          {casinos.map((casino, index) => (
            <CasinoCard key={index} {...casino} />
          ))}
        </div>
      </div>
      <div className="absolute -top-[50] w-full max-w-[650px] h-full max-h-[650px] blur-2xl opacity-30 rounded-full z-0 bg-primary" />
    </section>
  );
}
