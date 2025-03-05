"use client";

import React, { useLayoutEffect, useRef } from "react";
import { images } from "@/data";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { scaleIn } from "@/animations/headline";

import preview1 from "@/assets/login-image.png"
import preview2 from "@/assets/poker-preview.png"
import preview3 from "@/assets/preview1.png"


const CarouselSection = ({ currentIndex }) => {

  const swiperRef = useRef(null);
  const useswiper = useSwiper();
  useLayoutEffect(() => {
    const swiper = swiperRef.current;
    console.log(swiper)
    if (swiper) {
      scaleIn(swiper, true);
    }
  }, [])

  return (
    <div className="max-w-[300px] overflow-hidden lg-mid:max-w-[560px]" ref={swiperRef}>
      <Swiper
        modules={[Navigation]}
        loop
        navigation={{ nextEl: ".arrow-new-left", prevEl: ".arrow-new-right" }}
        centeredSlides={true}
        spaceBetween={15}
        slidesPerView={1}
      >
        {/* {images.map((src, index) => ( */}
        <SwiperSlide key={currentIndex} className="swiper-slide">
          {currentIndex === 0 && (
            <Image
              src={preview1}
              width={560}
              height={520}
              alt={`gamblify`}
              className="w-full h-auto"
            />
          )}
          {currentIndex === 1 && (
            <Image
              src={preview3}
              width={560}
              height={520}
              alt={`gamblify`}
              className="w-full h-auto"
            />
          )}
          {currentIndex === 2 && (
            <Image
              src={preview2}
              width={560}
              height={520}
              alt={`gamblify`}  
            />
          )}
        </SwiperSlide>
        {/* ))} */}
      </Swiper>
    </div>
  );
};

CarouselSection.displayName = "CarouselSection";

export default React.forwardRef(CarouselSection);