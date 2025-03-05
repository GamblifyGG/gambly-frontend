import Image from "next/image";
import Marquee from "react-fast-marquee";
import { BaseContext } from "@/context/BaseContext";
import { useContext, useEffect } from "react";
import Link from "next/link";
const CoinImage = ({ src, alt, casinoUrl }) => (
  <Link href={casinoUrl}>
    <Image src={src} width={64} height={64} alt={alt} className="rounded-full" />
  </Link>
);

const MarqueeSection = () => {
  const { tokensCache, networkTokens } = useContext(BaseContext);

  useEffect(() => {
    console.log("[PLAYING TOKENS]", tokensCache);
  }, [tokensCache]);

  const getCasinoUrl = (token) => {
    if (token.network.name === 'ethereum' || token.network.name === 'Ethereum') {
      return '/casinos/ethereum'
    }
    if (token.network.name === 'Solana' || token.network.name === 'solana') {
      return '/casinos/solana'
    }

    if(token.network.name === 'Sepolia' || token.network.name === 'sepolia') {
      return '/casinos/sepolia'
    }

    return '/casinos/ethereum'
  }

  return (
    <section className="bg-primary pt-5 pb-5 mb-32">
      <Marquee>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex gap-5 mr-5">
            {tokensCache &&
              tokensCache.map((token) =>
                token.logo ? (
                  <CoinImage
                    casinoUrl={getCasinoUrl(token) + "/" + token.address}
                    key={token.id}
                    src={token.logo}
                    className="w-10 h-10 rounded-full"
                    alt={`${token.name} logo`}
                  />
                ) : null
              )}
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default MarqueeSection;
