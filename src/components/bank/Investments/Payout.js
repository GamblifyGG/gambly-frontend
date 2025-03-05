import { useState } from "react";
import { formatUnits } from "viem";

const PayoutComp = ({ payout }) => {
    const [extraVisible, setExtraVisible] = useState(false)

    // const [payouts, setPayouts] = useState(payout.payouts)
    return (
        <div className="grid py-2  grid-cols-5 w-full h-auto justify-center items-center even:bg-gray odd:bg-darkgray">
            <span className="pl-2">#{payout.id}</span>
            <span className="ml-1">${payout.amount}</span>
            <span className="text-[7px] lg:text-xs">-</span>
            <span className="justify-self-end truncate lg:flex hidden">-</span>
            <span className="justify-self-end truncate lg:hidden flex">-</span>
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
                        <span>My Token Amount</span>
                        <span className="justify-self-end">USD Value</span>
                        {/* <span className="justify-self-end">Details</span> */}
                    </div>
                    {payout.payouts.map((payout_, index) => {
                        return (
                            <div key={index} className="grid grid-cols-4 w-full h-6 justify-center border-bordergray items-center border-y mt-2">
                                <span className="flex gap-2 items-center">{payout_.casino.token.name} <img src={payout_.casino.token.logo.includes('http') ? payout_.casino.token.logo : '/placeholder.png'} className="h-4 rounded-full border border-bordergray" /></span>
                                <span className="">{payout_.casino.token.symbol}</span>
                                {/* <span className="">${Number(payout_.PayoutValue).toFixed(2)}</span> */}
                                <span>{Number(formatUnits(payout_.amount, payout_.casino.token.decimals)).toFixed(8)}</span>
                                {/* <span>66%</span> */}
                                <span className="justify-self-end truncate">
                                    ${Number(payout_.amount).toFixed(2)}</span>
                                {/* <span className="justify-self-end pr-2  truncate text-primary underline hover:opacity-75 cursor-pointer">Show Details</span> */}
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default PayoutComp;