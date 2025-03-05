import Loading from "@/components/Loading";
import RevenueChart from "@/components/BurnChart";
import { Icon, GameBox, Iconify } from "@/components/common";
import { BaseContext } from "@/context/BaseContext";
import { convertNetworkID, convertNetworkNameToId } from "@/utils/convertNetworkID";
import { devlog } from "@/utils/common"
import Head from "next/head";


import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useRef } from "react";
import { formatUnits } from "viem";
import BurnChart from "@/components/BurnChart";
import BetsChart from "@/components/BetsChart";
import GameList from "@/components/common/GameList2";
import GameList2 from "@/components/common/GameList";
import Link from 'next/link'
import { getCasinoTopWinners, getCasino, getCasinoBetVolume, getCasinoBurnsVolume } from '@/api'
import { useIsVisible } from "@/hooks/index"

const RankTable = dynamic(() => import("@/components/casino/RankTable"), {
  ssr: false,
});
// const GameBox = dynamic(() => import('@/components/casino/GameBox'), { ssr: false })
const Hero = dynamic(() => import("@/components/casino/Hero"), { ssr: false });

const Casino = () => {
  const router = useRouter();
  const { network, token, casino, casinoLoading, casinoError } = useContext(BaseContext);
  const [loading, setLoading] = useState(false);
  const [winners, setWinners] = useState([])
  const [betStats, setBetStats] = useState([])
  const [burnStats, setBurnStats] = useState([])

  const statsRef = useRef()
  const statsVisible = useIsVisible(statsRef)

  const fetchTopWinners = async (chain_id, token_address, limit = 5) => {
    const [er, data] = await getCasinoTopWinners({ chain_id, token_address, limit })

    if (er) {
      console.log('[TOP WINNERS:ERR]', er)
    }

    if (data) {
      console.log('[TOP WINNERS]', data)
      setWinners(data?.bets)
    }
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short" });

  function getAllDaysBetween(start, end) {
    const days = [];
    const current = new Date(start);

    while (current <= end) {
      days.push(dateFormatter.format(current)); 
      current.setDate(current.getDate() + 1);
    }
  
    return days;
  }

  const toBetStats = (intervals, decimals) => {
      if (!intervals.length) return []

      // const startDate = new Date(intervals[0].interval_start)
      // const endDate = new Date(intervals.at(-1).interval_start)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 7)
      const days = getAllDaysBetween(startDate, endDate).map(name => ({ name, volume: 0 }))

      const data = intervals.map(({ interval_start, interval_end, total }) => {
        const d = new Date(interval_start)
        const volume = formatUnits(total, decimals)
        return {
          name: dateFormatter.format(d),
          volume,
        }
      })

      return days.map(({ name, volume }) => {
        const match = data.find(x => x.name === name)
        if (match) return match
        return { name, volume}
      })
      
  }

  const initCasino = async (network, token) => {
    setLoading(true)
    const window_duration = 864000
    const interval = 86400

    const [[er1, data1], [er2, data2], r] = await Promise.all([
      getCasinoBetVolume({ 
        chain_id: network.id,
        token_address: token.address,
        window_duration,
        interval
      }),
      getCasinoBurnsVolume({ 
        chain_id: network.id,
        token_address: token.address,
        window_duration,
        interval
      }),
      fetchTopWinners(network?.id, token?.address)
    ])

    setLoading(false)

    if (data1) {
      setBetStats(toBetStats(data1?.intervals, token?.decimals))
      console.log('[data1]', token?.name, data1)
    }

    if (data2) {
      setBurnStats(toBetStats(data2?.intervals, token?.decimals))
      console.log('[data2]', token?.name, data2)
    }

  }

  useEffect(()=> {
    console.log("[statsVisible]", statsVisible)
    if (statsVisible && casino) initCasino(casino?.token?.network, casino?.token)
  }, [statsVisible, casino, casinoError])

  return (
    <>
      <Head>
        <title>{ !token && !casinoLoading ? "Casino Not Found! - Gambly" : token ? `${token?.name} Casino - Gambly` : ""}</title>
      </Head>

      {(casinoLoading) && (
        <div className="cont flex items-center justify-center">
          <Loading />
        </div>
      )}

      {casinoError ? (
        <div className="cont flex flex-col items-center justify-center">
          <img src="/logo-letter.png" className="h-32 animate-pulse" />
          <div className="text-xl font-extrabold mb-4 text-red">Casino Not Found</div>
          <div className="mb-4">
            { casinoError }
          </div>
          <Link href={`/casinos/${network?.name}`} className="text-primary underline">View all casinos for { network.name }</Link>
        </div>
      ) : (
        !casinoLoading && casino && 
        (
          <div className="p-4 relative">
            <Hero
              log={{loading, casinoLoading, casino}}
              imageUrl={
                casino.token.logo !== null && casino.token.logo !== ""
                  ? casino.token.logo
                  : "/placeholder.png"
              }
              symbol={casino.token.symbol}
              name={casino.token.name}
            />
            <div className="casino-grid mt-4 grid gap-7">
              <div className="col-start-1 col-end-2 lg:col-end-3">
                <GameList2 tokenAddress={casino.token.address} network={convertNetworkID(casino.token.network.id)} />
              </div>
              <div ref={statsRef} className="col">
                <div className="my-5 flex items-center gap-4">
                  <Icon name="trophy" />
                  <span className="text-drak-200">Top All Time Wins</span>
                  { loading && <Iconify icon="tdesign:refresh" className="animate-spin text-[16px] inline-flex opacity-50" /> }
                </div>
                <RankTable users={winners} token={token} />
              </div>

              <div className="relative mb-20 flex flex-col">
                <div className="my-5 flex items-center gap-4">
                  <div className="bg-primary dot"></div>
                  <span className="text-drak-200">Casino Stats</span>
                 
                </div>

                <div className="mb-10 grid h-40 grid-cols-3 gap-4">
                  <div className="bg-dark-700 border-bordergray grid grid-rows-[50px_auto] rounded-lg border">
                    <div className="border-bordergray flex items-center justify-center border-b text-center text-xl">
                      Players
                    </div>
                    <div className="bg-dark-700 border-bordergray text-secondary flex items-center justify-center border-b text-center text-lg font-extrabold">
                      { casino.stats.players_total }
                    </div>
                  </div>

                  <div className="bg-dark-700 border-bordergray grid grid-rows-[50px_auto] rounded-lg border">
                    <div className="border-bordergray flex items-center justify-center border-b text-center text-xl">
                      Bet Volume
                    </div>
                    <div className="bg-dark-700 border-bordergray text-primary flex items-center justify-center border-b text-center text-lg font-bold px-2 min-w-0">

                      <div className="flex max-w-full gap-1">
                      <div className="truncate flex-1">
                        {(() => {
                          const value = formatUnits(casino?.stats?.bet_volume_total, token?.decimals);
                          const num = parseFloat(value);
                          const integerPart = Math.floor(num);
                          
                          // If integer part is more than 2 digits (≥ 10)
                          if (integerPart >= 10) {
                            return num.toFixed(4);
                          } 
                          // If integer part is 2 digits or less
                          else {
                            return num.toFixed(8);
                          }
                        })()}
                      </div>
                      <div className="text-white font-normal">{token?.symbol}</div>
                      </div>
                     
                     
                    </div>
                  </div>

                  <div className="bg-dark-700 border-bordergray grid grid-rows-[50px_auto] rounded-lg border">
                    <div className="border-bordergray flex items-center justify-center border-b text-center text-xl">
                      Total Burn
                    </div>
                    <div className="bg-dark-700 border-bordergray text-primary flex items-center justify-center border-b text-center text-lg font-extrabold">0
                      {/* {String(formatUnits(totalBurn, casino.TokenDecimals)).length > 8 ? Number(formatUnits(totalBurn, casino.TokenDecimals)).toFixed(8) : formatUnits(totalBurn, casino.TokenDecimals)} ${casino.TokenSymbol} */}
                    </div>
                  </div>
                </div>
                <div className="m flex h-[400px] flex-col gap-7 lg:grid-cols-2">
                  {/* <span className="text-drak-200">Casino Revenues</span> */}
                  <BetsChart tokenSymbol={token?.symbol} data2={betStats} />
                </div>
                <div className="m flex h-[400px] flex-col gap-7 mt-14 lg:grid-cols-2">
                  {/* <span className="text-drak-200">Casino Revenues</span> */}
                  <BurnChart tokenSymbol={casino.TokenSymbol} data2={burnStats} />
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

// Casino.getLayout = getLayout

export default Casino;
