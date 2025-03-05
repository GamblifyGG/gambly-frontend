import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import PayoutComp from "./Payout";

const MyPayouts = ({ payouts }) => {
    return (
        <div className="h-full">
            <div className="flex items-center justify-between p-4 border-b border-bordergray">
                <span>My Payouts</span>
                {/* <div className="flex h-10 text-xs items-center">10,000$ (5% Share)</div> */}
            </div>
            <div className="grid grid-cols-1 gap-2 relative h-full">
                <div className="grid text-xs lg:text-base grid-cols-5 p-2 border-b border-bordergray h-10">
                    <span>Payout ID</span>
                    <span>Total Value</span>
                    <span>My Share Value</span>
                    {/* <span>Your Share</span> */}
                    {/* <span>Total Users</span> */}
                    <span className="justify-end justify-self-end">Payout Date</span>
                    <span className="justify-end justify-self-end">Details</span>
                </div>
                <div className="absolute overflow-y-auto h-[calc(100%-100px)] w-full mt-10 ">

                    {payouts.map((payout, index) => {
                        return (
                            <div key={index} className="flex w-full flex-col text-xs border-b border-bordergray">
                                <PayoutComp payout={payout}></PayoutComp>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    );
}

export default MyPayouts;