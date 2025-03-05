import { useEffect, useState } from "react";
import { formatEther, formatUnits } from "viem";

const PastPayout = ({ payout }) => {
    const [extraVisible, setExtraVisible] = useState(false)

    useEffect(() => {
        console.log(payout)
    }, [])

    // const [payouts, setPayouts] = useState(payout.payouts)
    return (
        <div className="grid py-2 border-y border-bordergray text-xs grid-cols-5 w-full h-auto justify-center items-center even:bg-gray odd:bg-darkgray">
            <span className="pl-2">#{payout.ID}</span>
            <span className="ml-1">${payout.USDWorth}</span>
            <span className="text-[7px] lg:text-xs flex items-center gap-1">{Number(formatEther(Number(payout.TotalTokensLocked).toLocaleString('fullwide', { useGrouping: false }))).toLocaleString()} <img src="/logo-letter.png" className="h-4"></img></span>
            <span className="justify-self-end truncate lg:flex hidden">{new Date(payout.TimeFinished).toDateString()} - {new Date(payout.TimeFinished).toLocaleTimeString()}</span>
            <span className="justify-self-end truncate lg:hidden flex">{new Date(payout.TimeFinished).toLocaleDateString()}</span>
            <span onClick={() => {
                setExtraVisible(!extraVisible)
            }} className="pr-2 justify-self-end truncate text-primary underline hover:opacity-75 cursor-pointer">{
                    extraVisible ? 'Hide Details' : 'Show Details'
                }</span>
            {
                extraVisible &&
                <div className="col-span-5 bg-dark p-2 mt-2">
                    <div className="grid grid-cols-4 ">
                        <span>Token Name</span>
                        <span>Token Symbol</span>
                        <span>Token Amount</span>
                        <span className="justify-self-end">USD Value</span>
                        {/* <span className="justify-self-end">Details</span> */}
                    </div>
                    {payout.payouts.map((payout_, index) => {
                        return (
                            <div key={index} className="grid grid-cols-4 w-full h-6 justify-center border-bordergray items-center border-y mt-2">
                                <span className="flex gap-2 items-center">{payout_.TokenName} <img src={payout_.TokenLogo !== null ? payout_.TokenLogo : '/placeholder.png'} className="h-4 rounded-full border border-bordergray" /></span>
                                <span>{payout_.TokenSymbol}</span>
                                <span>{formatUnits(payout_.TokenAmount, payout_.TokenDecimals)} {payout_.TokenSymbol}</span>
                                <span className="justify-self-end">${Number(payout_.TokensValueUSD).toFixed(2)}</span>
                                {/* <span className="justify-self-end underline text-primary cursor-pointer hover:opacity-75">Details</span> */}
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default PastPayout;