import Eth from "@/components/basic/icons/eth";
import Image from "next/image";
import { formatUnits } from 'viem'
import Link from 'next/link'
import { Iconify } from "@/components/common"
import { useEffect } from "react"
const CasinoCard = ({ token, stats }) => {


  useEffect(() => {
    console.log('[token]', token)
  }, [token])

  return (
    <Link href={`/casinos/${token?.network?.name?.toLowerCase()}/${token?.address}`}>
      <div className="group border border-gray bg-darkgray hover:scale-[1.05] transition-all duration-300 overflow-hidden  grid grid-cols-[40%_auto] from-dark-250 to-dark-350 relative rounded-xl">
        <div className="group-hover:opacity-100 transition-all duration-300 opacity-50 z-0 blur-2xl bottom-[-60px] left-0 absolute  from-primary to-secondary-300 w-[55%] h-full"></div>

        {token?.network?.logo && (
            <div className="absolute top-4 right-5 w-8 h-8 rounded-full overflow-hidden border border-lightgray shadow-md">
              <img 
                src={token.network.logo} 
                alt={token.network.name || "Network"} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

        <div className="relative z-1 w-full pl-4 py-4 flex items-center justify-center rounded-l-xl">
          <img
            src={token?.logo || "/placeholder.png"}
            alt=""
            className="w-[90%] h-auto rounded-full shadow-xl border border-lightgray"
          />
        </div>

        <div className="z-2 relative flex flex-col text-white p-4">
          <div className="py-4 flex-1 leading-none flex flex-col justify-center">
            <div className="text-primary mb-1 text-xl font-bold leading-none pt-2">{token.symbol}</div>
            <div className="text-lg leading-none">Casino</div>
          </div>

          <div className="relative p-2 py-3  bg-dark/60 group-hover:bg-dark/80 transition-all duration-300 rounded-lg text-xs flex flex-col gap-1">

            <div className="flex gap-2 items-center">
              <Iconify icon="ic:round-bar-chart" className="text-primary"/>
              {token?.symbol == "BROKENWEENUS" ? "0" : Number(formatUnits(stats?.bet_volume_total, token?.decimals)).toFixed(8)}
            </div>
            <div className="flex gap-2 items-center">
              <Iconify icon="famicons:people"  className="text-primary"/> {stats?.players_total} Members
            </div>
            {/* <div className="flex gap-2 items-center">
              <Iconify icon="fa-solid:dice"  className="text-primary"/> {stats?.poker_tables + stats?.coinflip_games + stats?.rps_games} Games
            </div> */}

            <div className="group-hover:animate-pulse absolute right-2 top-[50%] translate-y-[-50%] flex items-center justify-center rounded-full bg-secondary h-6 w-6">
              <Iconify icon="mingcute:right-fill" className="text-dark text-xl"/>
            </div>
          </div>


        </div>


      </div>
    </Link>
  );
};

export default CasinoCard;
