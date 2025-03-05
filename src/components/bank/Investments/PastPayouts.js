import { useEffect } from "react";
import PastPayout from "./PastPayout";

const PastPayouts = ({ pastPayouts }) => {

    useEffect(() => {
        console.log(pastPayouts)
    }, [])
    return (
        <div className="h-full">
            <div className="flex items-center justify-between p-4 border-b border-bordergray">
                <span>Past Payouts</span>
                {/* <div className="flex h-10 text-xs items-center">10,000$ (5% Share)</div> */}
            </div>
            <div className="grid grid-cols-1 gap-2 relative h-full">
                <div className="grid text-xs lg:text-base grid-cols-5 p-2 h-10">
                    <span>Payout ID</span>
                    <span>Total Value</span>
                    {/* <span>Total Users</span> */}
                    <span>Total Locked</span>
                    <span className="justify-self-end">Payout Date</span>
                    <span className="justify-self-end">Details</span>
                </div>
                <div className="absolute overflow-y-auto h-[calc(100%-100px)] w-full mt-10 ">
                    {pastPayouts.map((payout, index) => {
                        return <PastPayout key={index} payout={payout}></PastPayout>
                        // return (
                        //     <div key={index} className="flex w-full flex-col text-xs border-b border-bordergray">
                        //         <div className="grid grid-cols-5 p-2">
                        //             <span>#{payout.ID}</span>
                        //             <span>${payout.USDWorth}</span>
                        //             <span>{payout.TotalUsers}</span>
                        //             <span>{new Date(payout.TimeFinished).toLocaleDateString()}</span>
                        //             <span className="justify-self-end underline text-primary cursor-pointer hover:opacity-75">Details</span>
                        //         </div>
                        //     </div>
                        // )
                    })}

                </div>
            </div>
        </div>
    );
}

export default PastPayouts;