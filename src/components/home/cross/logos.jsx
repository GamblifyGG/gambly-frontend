import { logos } from "@/data";
import Image from "next/image";
import logo from "@/assets/blockchain-logos.png"

const BlockchainLogos = () => {
  return (
    <div className="flex flex-row gap-2 md:flex-col">
      <Image
        src={logo}
        alt={"Blockchain Logos"}
        // height={600}
        // width={100}
        className="h-[600px] object-contain"
      />
      {/* {logos.map((logo, index) => (
        <Image
          key={index}
          src={logo.src}
          width={60}
          maxWidth={50}
          height={60}
          alt={logo.alt}
          className="min-w-[60px]"
        />
      ))} */}
    </div>
  );
};

export default BlockchainLogos;
