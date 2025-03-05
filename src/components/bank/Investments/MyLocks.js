import { useEffect } from "react";
import { formatEther } from "viem";
import MyLock from "./MyLock";
import { Iconify } from "@/components/common"

const MyLocks = ({ locks, token, loading }) => {

    useEffect(() => {
        console.log(locks)
    }, [])

    return (
        <div className="h-full relative">
                            { loading &&
                    <div className="absolute inset-0 z-10 bg-white/5 flex justify-center items-center">
                        <div>Refreshing...</div>
                    </div>
                }
            <div className="flex items-center justify-between p-4 border-b border-bordergray">
                <span>My Locks</span>
                {/* <div className="flex h-10 text-xs items-center">50,000<img src="/logo-letter.png" className="h-6"></img> tokens (5% of all payouts)</div> */}
            </div>
            <div className="grid grid-cols-1 gap-2 relative h-full">

                <div className="grid text-xs lg:text-base grid-cols-4 p-2 border-b border-bordergray h-10">
                    <span>Lock ID</span>
                    <span>Locked Amount</span>
                    {/* <span>Duration</span> */}
                    <span className="justify-self-end">Start Date</span>
                    <span className="justify-self-end">End Date</span>
                </div>
                <div className="absolute overflow-y-auto h-[calc(100%-100px)] w-full mt-10 ">
                    {locks?.userLocks?.map((lock, index) => {
                        return (
                            <MyLock key={index} token={token} lock={lock} />
                        )
                    })}
                    {/* <div className="grid grid-cols-5 text-xs p-2 border-b border-bordergray">
                        <span>#1</span>
                        <div className="flex items-center gap">50,000<img src="/logo-letter.png" className="h-4"></img></div>
                        <span>1 Year</span>
                        <span>2021-09-01</span>
                        <span className="justify-self-end">2022-09-01</span>
                    </div>
                    <div className="grid grid-cols-5 text-xs p-2 border-b border-bordergray">
                        <span>#1</span>
                        <div className="flex items-center gap">50,000<img src="/logo-letter.png" className="h-4"></img></div>
                        <span>1 Year</span>
                        <span>2021-09-01</span>
                        <span className="justify-self-end">2022-09-01</span>
                    </div> */}

                </div>
            </div>
        </div>
    );
}

export default MyLocks;