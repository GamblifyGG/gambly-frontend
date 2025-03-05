import { useContext, useRef } from "react";
import { BaseContext } from "@/context/BaseContext";
import { formatUnits } from "viem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { convertNetworkID } from "@/utils/convertNetworkID";
import Link from 'next/link'

const BalanceWindow = ({ balanceWindowOpen, setBalanceWindowOpen }) => {
    const { balances, balancesLoading, token } = useContext(BaseContext);
    const router = useRouter();
    const maxLen = 6

    if (!balanceWindowOpen) return null;

    return (<div className='absolute top-[50px] lg:top-[60px] w-[200px] -right-[25px] lg:right-[50px] z-50 bg-gray border border-bordergray rounded-md p-2 flex flex-col'>
        <div className='text-xs flex items-center justify-between pb-3 pt-1'>
            <span>My Tokens</span>
            <FontAwesomeIcon className='text-primary hover:text-red cursor-pointer' onClick={() => {
                setBalanceWindowOpen(false)
            }} icon={faClose}></FontAwesomeIcon>
        </div>
        <div className={`${balancesLoading ? 'opacity-10' : ''} w-full overflow-y-auto flex flex-col gap-1`}>
            { !balances.length ?
                <div className="h-10 grid grid-cols-3 w-full border-b border-dark-200 items-center justify-center">
                    <Link href="/bank" className='col-span-3 text-center text-xs bg-secondary rounded-md text-gray cursor-pointer hover:opacity-75'>
                        Deposit
                    </Link>
                </div>
                :
                balances.slice(0,maxLen).map((token, index) => 
                    <Link
                        key={index}
                        href={`/casinos/${convertNetworkID(token.token.network.id)}/${token.token.address}`}
                        className="cursor-pointer text-xs p-1 pr-2 flex gap-2 w-full border-b bg-darkgray rounded-md border hover:bg-secondary hover:text-dark border-bordergray items-center"
                    >
                        <img src={token?.token?.logo} className='w-6 h-auto rounded-full border border-bordergray' />
                        <div>{token.token.symbol}</div>
                        <div className='ml-auto text-end truncate ...'>{formatUnits(token.balance, token.token.decimals)}</div>
                    </Link>
                )

            }
            { balances?.length > maxLen && 
                <div className="text-center">
                    <Link className="text-sm py-2 block text-primary underline" href="/bank?page=balances">+{balances?.length - maxLen} More tokens</Link>
                </div>
            }
            <div className="text-center">
                <Link className="rounded-md cursor-pointer text-xs p-2 block text-center border border-green text-green" href="/bank?page=balances">+ Deposit {token?.symbol}</Link>
            </div>
        </div>
    </div>)
}

export default BalanceWindow;