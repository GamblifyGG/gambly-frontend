import { Button } from "../form";
import { useEffect, useState, useContext, useRef } from "react";
import useStateRef from "react-usestateref";
import { formatUnits } from "viem";
import { useRouter } from "next/router";
import { getUserBalance } from '@/api'
import { BaseContext } from '@/context/BaseContext'

// import Loading from "../Loading";

const Balances = ({ setShowModalWithdrawal }) => {
    const { network } = useContext(BaseContext)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [totalBalances, setTotalBalances] = useState(0);
    const [balances, setBalances] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage, currentPageRef] = useStateRef(1);
    const [limit, setLimit] = useState(10)
    const afterIdRef = useRef(null)
    const idsRef = useRef({})

    const router = useRouter();

    const nextPage = () => {
        if (currentPageRef.current === totalPages) return;
        afterIdRef.current = idsRef.current[currentPageRef.current]
        setCurrentPage(currentPageRef.current + 1);
        getMyBalances()
    }

    const prevPage = () => {
        if (currentPageRef.current === 1) return;
        afterIdRef.current = currentPageRef.current == 2 ? null : idsRef.current[currentPageRef.current - 2]
        setCurrentPage(currentPageRef.current - 1);
        getMyBalances()
    }

    const getMyBalances = async () => {
        setLoading(true)
        const [er, data] = await getUserBalance({
            limit,
            after: afterIdRef.current
        })
        console.log("DATA", data)
        setLoading(false)

        if (er) {
            setError(er?.details || er?.message)
        }

        if (data) {
            console.log("DATA", data)
            setTotalPages(Math.max(1, Math.ceil(data.meta.total / limit)))
            if (data.balances.length) idsRef.current[currentPageRef.current] = data.balances.at(-1)?.id
            setBalances(data?.balances)
        }
    }

    useEffect(() => {
        if (!network) return
        getMyBalances();
    }, [network])

    return (
        <div className="h-[300px] lg:h-[380px] mt-4 flex flex-col">
            <div className="rounded-md border border-gray flex-grow">
                <div className="w-full text-whitegrey relative h-full">
                    <div>
                        <div className="opacity-50 px-4 justify-between border-b border-gray grid grid-cols-4 lg:grid-cols-5 h-14 items-center">
                            <div className="justify-start flex">Logo</div>
                            <div className="justify-start flex">Token</div>
                            <div className="justify-start flex">Balance</div>
                            <div className="justify-start truncate ... overflow-hidden lg:flex hidden">Pending Withdrawal</div>
                            <div className="justify-end flex">Actions</div>
                        </div>
                    </div>

                    {loading &&
                        <div className="overflow-y-auto h-[calc(100%-60px)] w-full absolute flex items-center justify-center">
                            Loading...
                        </div>
                    }

                    {!loading &&
                        <div className="overflow-y-auto h-[calc(100%-60px)] w-full absolute">
                            {
                                balances.length === 0 ?
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-whitegrey">No Tokens Found</span>
                                    </div> :

                                    balances.map(x => (
                                        <div className="grid w-full h-14 items-center justify-center px-4 grid-cols-4  lg:grid-cols-5 odd:bg-dark-700 even:bg-gray" key={x.id}>
                                            <div className='text-sm'>
                                                <img
                                                    onClick={() => router.push(`/casinos/${x.token.network.name.toLowerCase()}/${x.token.address}`)}
                                                    className="h-10 w-10 hover:opacity-90 cursor-pointer  p-1 rounded-full border border-lightgray object-contain" src={x.token?.logo}
                                                />
            
                                            </div>
                                            <div onClick={() => {
                                                // router.push(`/casinos/${convertNetworkID(x.NetworkID)}/${x.TokenAddress}`)
                                            }} className='lg:flex hidden  text-sm truncate ...'>
                                                <span onClick={() => {
                                                    router.push(`/casinos/${x.token.network.name.toLowerCase()}/${x.token.address}`)
                                                }} className="underline hover:text-primary cursor-pointer truncate ...">{x.token.name}</span>
                                            </div>
                                            <div className='lg:hidden flex text-sm truncate ...'>
                                                {x.token.symbol}
                                            </div>
                                            <div className="truncate ... flex">
                                                {formatUnits(String(x.balance), x.token.decimals)} {x.token.symbol}
                                            </div>
                                            <div className="truncate ... lg:flex hidden">0
                                                {/* {x.FrozenTokenAmount.length > 8 ? Number(x.FrozenTokenAmount).toFixed(8) : Number(x.FrozenTokenAmount)} {x.TokenSymbol} */}
                                            </div>
                                            <div className="flex justify-end items-end flex-col gap-1">
                                                <Button size="sm" variant="secondary-outline" onClick={() => {
                                                    console.log("WITHDRAWAL MODAL OPENING", x)
                                                    setShowModalWithdrawal(x);
                                                }
                                                }>
                                                    Withdraw
                                                </Button>

                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    }
                </div>
            </div>
            <div className="flex items-center gap-5">
                <Button
                    variant="clear"
                    disabled={currentPage == 1}
                    onClick={prevPage}
                ><iconify-icon icon="bx:caret-left"></iconify-icon>previous</Button>
                { totalPages ? currentPage : '0'} / {totalPages}
                <Button
                    variant="clear"
                    disabled={currentPage == totalPages || !totalPages}
                    onClick={nextPage}
                >next<iconify-icon icon="bx:caret-right"></iconify-icon></Button>
            </div>
        </div>
    );
}

export default Balances;