import Loading from "@/components/Loading";
import LoadingSmall from "@/components/LoadingSmall";
import { convertNetworkID, convertNetworkIDToSymbol } from "@/utils/convertNetworkID";
import convertNetworkToImage from "@/utils/convertNetworkToImage";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";

const UpcomingPayouts = ({ nextPayoutTime }) => {


    const [loading, setLoading] = useState(true);
    const [pageID, setPageID] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(300);
    const [upcomingPayouts, setUpcomingPayouts] = useState([]);
    const [myPercentage, setMyPercentage] = useState(0);
    const [totalLocked, setTotalLocked] = useState(0);




    useEffect(() => {
        let accessToken = localStorage.getItem('token');
        let refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
            return;
        } else {
            // check if accessToken is valid
            axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/transactions/getUpcomingPayouts/' + pageID + '/' + itemsPerPage + '/' + '?accessToken=' + accessToken + '&refreshToken=' + refreshToken).then((response) => {
                console.log(response.data)
                if (response.data.success) {
                    setUpcomingPayouts(response.data.upcomingPayouts)
                    setMyPercentage(response.data.userLocks.percentageLocked)
                    setLoading(false)
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    }, []);




    return (
        <div className="h-full">
            <div className="flex items-center justify-between p-4 border-b border-bordergray">
                <span>Upcoming Payout</span>
                <div className="flex h-auto text-xs items-center">Next payout: {new Date(nextPayoutTime).toLocaleDateString()} - {new Date(nextPayoutTime).toLocaleTimeString()} </div>
            </div>
            <div className="grid grid-cols-1 gap-2 relative h-full">
                <div className="grid text-xs lg:text-base grid-cols-5 p-2 border-b border-bordergray h-10">
                    <span>Token</span>
                    <span>Network</span>
                    <span className="justify-end self-end justify-self-end">Amount</span>
                    <span className="justify-end self-end justify-self-end">Value</span>
                    <span className="justify-end self-end justify-self-end">Your Share</span>
                </div>
                <div className="absolute overflow-y-auto h-[calc(100%-100px)] w-full mt-10 ">
                    {loading ?
                        <div className="flex items-center justify-center h-full">
                            <LoadingSmall />
                        </div>
                        :

                        upcomingPayouts.length === 0 ?
                            <div className="flex items-center justify-center h-full">
                                No upcoming payouts
                            </div>
                            :

                            upcomingPayouts.map((payout, index) => {
                                return (
                                    <div key={index} className="grid grid-cols-5 text-xs p-2 border-b border-bordergray">
                                        <div className="flex gap-1 items-center">
                                            <span className="truncate">{payout.TokenName}</span>
                                            {payout.TokenLogo !== null ? <img src={payout.TokenLogo} className="h-4"></img> :
                                                <img src='/placeholder.png' className='h-4' alt=""></img>
                                            }
                                        </div>
                                        <div className="flex items-center gap-1">{convertNetworkIDToSymbol(Number(payout.NetworkID))}<img src={convertNetworkToImage(Number(payout.NetworkID))} className="h-4" alt=""></img></div>
                                        <div className="flex gap-1 items-center justify-self-end">
                                            <span>{formatUnits(payout.TotalProfitsForInvestors, payout.TokenDecimals)} {payout.TokenSymbol}</span>
                                            {/* <span>(500$)</span> */}
                                        </div>
                                        <span className="justify-self-end">${Number(payout.TokenPriceUSD * formatUnits(payout.TotalProfitsForInvestors, payout.TokenDecimals)).toFixed(2)}</span>
                                        <span className="justify-self-end">~${Number(Number(payout.TokenPriceUSD * formatUnits(payout.TotalProfitsForInvestors, payout.TokenDecimals)).toFixed(2) * Number((myPercentage || 0) / 100)).toFixed(2)}</span>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
        </div>
    );
}

export default UpcomingPayouts;