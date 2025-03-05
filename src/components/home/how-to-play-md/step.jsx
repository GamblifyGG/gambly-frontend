import Image from "next/image";
import React from 'react';
import casinoPreview from "@/assets/casino-preview.png"
const Step = React.forwardRef(({ Icon, title, description, image}, ref) => (
  <div className="flex flex-col mb-5" ref={ref}>
    <div className="flex items-start gap-5 mb-5">
      <div className="min-w-[25px]">
        <Icon className="w-full h-auto" />
      </div>
      <div className="text-white">
        <h2 className="font-semibold text-base mb-2">{title}</h2>
        <p className="text-xs">{description}</p>
      </div>
    </div>
    <Image
      src={image}
      width={560}
      height={520}
      alt="gamblify"
      className="w-full h-auto"
    />
  </div>
));

export default Step;