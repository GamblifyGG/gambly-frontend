import convertNetworkIdToScanLink from "@/utils/convertNetworkIdScanLink";
import { faDice, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Button } from "../form";
import Link from "next/link";
import { convertNetworkID } from "@/utils/convertNetworkID";
import { useContext, useEffect, useState, useRef } from "react";
import useStateRef from "react-usestateref";
import { timeAgo, getExplorerLink, shortDate } from "@/utils/common"
// import Loading from "../Loading";

// dynamic
import dynamic from 'next/dynamic'
import { useRouter } from "next/router";
import { formatUnits } from 'viem'
import { BaseContext } from "@/context/BaseContext";
import { getUserTransactions } from '@/api'
import { Iconify } from "@/components/common"

// dynamic imoprt button
const Button = dynamic(() => import('@/components/form/Button'))


const Transactions = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactions, setTransactions, transactionsRef] = useStateRef([]);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10)
    const [currentPage, setCurrentPage, currentPageRef] = useStateRef(1);
    const { user } = useContext(BaseContext);
    const afterIdRef = useRef(null)
    const idsRef = useRef({})

    const nextPage = () => {
        if (currentPageRef.current === totalPages) return;
        afterIdRef.current = idsRef.current[currentPageRef.current]
        setCurrentPage(currentPageRef.current + 1);
        getMyTransactions()
    }

    const prevPage = () => {
        if (currentPageRef.current === 1) return;
        afterIdRef.current = currentPageRef.current == 2 ? null : idsRef.current[currentPageRef.current - 2]
        setCurrentPage(currentPageRef.current - 1);
        getMyTransactions()
    }

    function toTableData(row, tokens) {
        return row.map(r => {
            return {
                ...r,
                token: tokens.find(x => x.id === r.token.id) 
            }
        })
    }

    const getMyTransactions = async () => {
        setLoading(true)
        const [er, data] = await getUserTransactions({ 
            limit,
            order: 'desc',
            after: afterIdRef.current
        })

        console.log("DATA: ", data)

        if (data) {
            setTotalPages(Math.max(1, Math.ceil(data.meta.total / limit)))
            const table = toTableData(data.transactions, data.tokens)
            setTransactions(table)
            if (data.transactions.length) idsRef.current[currentPageRef.current] = data.transactions.at(-1)?.id
        }

        setLoading(false)
    }

    useEffect(() => {
        if (user) getMyTransactions()
    }, [])

    return (
        <div className="h-[300px] lg:h-[380px] mt-4 flex flex-col w-full">
            <div className="rounded-md border border-gray flex-grow overflow-x-auto max-w-full">
                <div className="w-[600px] sm:w-full text-whitegrey relative h-full">
                    <div className="w-full">
                        <div className="w-full opacity-50 px-4 border-b border-gray grid grid-cols-6 h-14 items-center">
                            <div className="justify-start flex">Token</div>
                            <div className="justify-start flex">Type</div>
                            <div className="justify-start flex">Time</div>
                            <div className="justify-start flex">Amount</div>
                            <div className="justify-start flex">Status</div>
                            <div className="justify-end flex">Actions</div>
                        </div>
                    </div>

                    {loading &&
                        <div className="overflow-y-auto h-[calc(100%-60px)] w-full absolute flex items-center justify-center">    
                            Loading...
                        </div>
                    }

                    {!loading &&
                        <div className="overflow-y-auto h-[calc(100%-60px)] w-full absolute text-sm leading-none">
                            {
                                transactions.length === 0 ?
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-whitegrey">No transactions found</span>
                                    </div> :

                                    transactions.map(x => (
                                        <div key={x.id} className="grid w-full h-14 items-center justify-center px-2 grid-cols-6 even:bg-gray">
                                            <div className='flex items-start gap-1'>
                                                <img src={x.token?.logo} alt="" className="h-[15px] w-auto top-1 relative"/>
                                                <Link class="flex flex-col gap-1" href={`/casinos/${x.token?.network?.name?.toLowerCase()}/${x.token?.address}`}>
                                                    <span className="font-bold hover:text-white">{x.token?.symbol}</span>
                                                    <small className="text-xs opacity-50 capitalize">{x.token?.name}</small>
                                                </Link> 
                                            </div>

                          
                                            <div className={`text-xs uppercase ${x.is_transfer ? 'text-primary' : (x.amount[0] == '-' ? 'text-red' : 'text-green')}`}>
                                                {x.is_transfer ? 'Transfer' : (x.amount[0] == '-' ? 'Withdrawal' : 'Deposit')}
                                            </div>
                         

                                            <div className="flex flex-col gap-1">
                                                <span>{shortDate(x.created)}</span>
                                                <span className="text-xs opacity-50">{timeAgo(x.created)}</span>
                                            </div>

                                            <div>
                                                {formatUnits(String(x.amount), x?.token?.decimals)}
                                            </div>
                                            <div>
                                                <span className="">{
                                                    x.completed ?
                                                        <span className='text-green truncate ...'>Done</span>
                                                        :
                                                        <span className="truncate text-primary ...">Pending...</span>
                                                }</span>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                
                                                { !x.is_transfer && (x.txid ?
                                                <Button
                                                    size="sm"
                                                    href={getExplorerLink(x.txid, x.token.network.id)}
                                                    target="_blank"
                                                    variant="secondary-outline"
                                                >View Tx</Button>
                                                : <>
                                                 <Button size="sm" variant="primary-outline" onClick={() => router.push(`/bank?page=balances`) }>Retry</Button>
                                                </>)
                                           
                                            }

                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    }
                </div>
            </div>
            <div className="flex items-center gap-5 mt-4">
                <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage == 1}
                    onClick={prevPage}
                ><Iconify icon="bx:caret-left" />Previous</Button>
                {currentPage} / {totalPages}
                <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage == totalPages}
                    onClick={nextPage}
                >Next<Iconify icon="bx:caret-right" /></Button>
            </div>
        </div>
    );
}

export default Transactions;