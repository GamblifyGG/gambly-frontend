import { useEffect } from "react";
import { formatUnits } from "viem";
import { useEvmUnlock } from "@/hooks/unlock.evm"
import { Button } from "@/components/form"
import { timeUntil } from "@/utils/common"
import { toast } from 'react-toastify'

const MyLock = ({ lock, token }) => {
    const { unlock, isPending, isSuccess, isError, txData } = useEvmUnlock({
        token,
        lockId: lock.id,
    })

    useEffect(() => {
        if (txData) toast.success(<p>Tokens unlocked! <br></br><a href={txData?.url} target="_blank">{txData?.txId}</a></p>)
    }, [txData])

    return (<div className="grid grid-cols-4 gap-2 text-xs p-2 border-b border-bordergray">
        <div className="truncate max-w-full overflow-hidden whitespace-nowrap">#{lock.id}</div>
        <div className="flex items-center gap-1">{formatUnits(lock.amount, token.decimals)}</div>
        {/* <span>2 Months</span> */}
        <span className="justify-self-end">{new Date(lock.created).toLocaleDateString()}</span>

        <div className="flex justify-end">
            { lock.unlocked &&
            <div className="flex gap-1 items-center capitalize">
                <span className="text-green font-medium">unlocked</span>

            </div>
            }
            { !lock.unlocked && lock.unlockable && new Date(lock.unlockable).getTime() > new Date().getTime() &&
                <div className="text-right">
                    <div>{new Date(lock.unlockable).toLocaleDateString()}</div>
                    <div className="flex gap-1 justify-end items-center">
                        <small className="opacity-50">{timeUntil(lock.unlockable)}</small>
                        <span className="bg-green rounded-full h-2 w-2"></span>
                    </div>
                    
                </div>
            }
            { !lock.unlocked && lock.unlockable && new Date(lock.unlockable).getTime() < new Date().getTime() &&
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={unlock}
                    busy={isPending}
                    disabled={isSuccess}
                >{ isSuccess ? 'Unlocked!' : isPending ? 'Unlocking...' : 'Unlock'}</Button>
            }
        </div>

    </div>);
}

export default MyLock;