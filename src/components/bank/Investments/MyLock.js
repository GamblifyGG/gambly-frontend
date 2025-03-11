import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useEvmUnlock } from "@/hooks/unlock.evm"
import { Button } from "@/components/form"
import { timeUntil } from "@/utils/common"
import { toast } from 'react-toastify'
import { unlockLock } from "@/api/lock"
const MyLock = ({ lock, token }) => {


    const [unlocked, setUnlocked] = useState(false)
    const [unlockable, setUnlockable] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    useEffect(() => {
        if (lock) {
            if (new Date(lock.unlockable).getTime() < new Date().getTime()) {
                setUnlockable(true)
            }
        }
    }, [lock])

    const unlock = () => {
        setIsPending(true)
        console.log(lock)
        unlockLock({ lockId: lock.id }).then((res) => {
            console.log(res)
            setIsSuccess(true)
            setIsPending(false)
        }).catch((err) => {
            console.log(err)
            setIsError(true)
            setIsPending(false)
        })
    }


    // const { unlock, isPending, isSuccess, isError, txData } = useEvmUnlock({
    //     token,
    //     lockId: lock.id,
    // })


    // useEffect(() => {
    //     if (txData) toast.success(<p>Tokens unlocked! <br></br><a href={txData?.url} target="_blank">{txData?.txId}</a></p>)
    // }, [txData])

    return (<div className="grid grid-cols-4 gap-2 text-xs p-2 border-b border-bordergray">
        <div className="justify-center truncate border border-bordergray rounded-md p-2 items-center flex">{lock.id}</div>
        <div className="flex items-center gap-1 border border-bordergray rounded-md p-2">{formatUnits(lock.amount, 6)} <img src="/logo-letter.png" className="h-4"></img></div>
        {/* <span>2 Months</span> */}
        <span className="justify-self-end border border-bordergray rounded-md p-2 items-center flex">{new Date(lock.created).toLocaleString()}</span>

        <div className="flex justify-end">
            {lock.unlocked &&
                <div className="flex gap-1 items-center capitalize">
                    <Button
                        size="sm"
                        variant="secondary"
                        busy={false}
                        disabled={true}
                    >Unlocked!</Button>
                </div>
            }
            {!lock.unlocked && lock.unlockable && new Date(lock.unlockable).getTime() > new Date().getTime() &&
                <div className="text-right border border-bordergray rounded-md p-2 items-center flex">
                    <div>{new Date(lock.unlockable).toLocaleDateString() + " " + new Date(lock.unlockable).toLocaleTimeString()}</div>
                </div>
            }


            {!lock.unlocked && lock.unlockable && new Date(lock.unlockable).getTime() < new Date().getTime() &&
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={unlock}
                    busy={isPending}
                    disabled={isSuccess}
                >{isSuccess ? 'Unlocked!' : isPending ? 'Unlocking...' : 'Unlock'}</Button>
            }
        </div>

    </div>);
}

export default MyLock;