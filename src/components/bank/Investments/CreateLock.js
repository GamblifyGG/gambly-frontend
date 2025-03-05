'use client'

import { faLock, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSwitchChain, useWriteContract, useReadContract, useChainId } from "wagmi";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { useEvmLock } from "@/hooks/lock.evm";
import { Iconify } from "@/components/common";
import { Button } from "@/components/form"


const CreateLock = ({ token, balance }) => {
    const { switchChainAsync, isError: switchNetworkError, isSuccess: isSuccessSwitchNetwork } = useSwitchChain()
    const { address, account, chainId } = useAccount()

    const [amountToLock, setAmountToLock] = useState(0)
    const [amountToLockWei, setAmountToLockWei] = useState(0)
    const [allowance, setAllowance] = useState(0)
    const [endDate, setEndDate] = useState(0)

    const {
        isApproved,
        isApproving,
        approveIsConfirming,
        approveLock,
        lockToken,
        isPending,
        txData,
        shortError,
        isSuccess,
        isError,
        resetAll
    } = useEvmLock({ 
        lockContractAddress: token?.network?.lock_contract_address,
        token,
        amount: amountToLockWei
    })


    useEffect(() => {
        let endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 2)
        setEndDate(endDate.toDateString())
        resetAll()
    }, [])


    return (
        <div className="h-full p-4 flex w-full flex-col gap-4">
            <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                    <div className="items-center flex gap-2">
                        <img width="20" src={token?.logo} alt="" />
                        <span>Create a new lock ({token?.symbol})</span>
                    </div>
                    
                    <div className="flex items-center relative justify-center">
                        <FontAwesomeIcon icon={faLock} className="text-[16px]"></FontAwesomeIcon>
                        <FontAwesomeIcon icon={faPlusCircle} className="text-green left-2 bg-white rounded-full absolute text-[10px]"></FontAwesomeIcon>
                    </div>
                </div>
                <span className="text-xs text-lightgray">Lock your tokens for a certain period of time and earn a percentage of all the sites profits.</span>
            </div>

            <div className="flex flex-col gap-2 h-full">
                { !isSuccess && 
                <>
                <div className="flex flex-col gap-2">
                    <span>Lock Amount (Balance: {formatUnits(balance, token?.decimals)})</span>
                    <input onChange={(e) => {
                        let value = e.target.value
                        if (value < 0) {
                            value = 0
                        }
                        if (value > 0) {
                            setAmountToLock(value)
                            setAmountToLockWei(parseUnits(value, token?.decimals))
                        } else {
                            setAmountToLock(0)
                            setAmountToLockWei(0)
                        }
                    }} type="number" className="border bg-dark outline-none border-bordergray rounded-md p-2"></input>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Lock Duration</span>
                    <select className="border border-bordergray bg-dark outline-none rounded-md p-2">
                        <option>2 Months</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Lock End Date</span>
                    <input value={endDate} disabled type="text" className="border bg-dark outline-none border-bordergray rounded-md p-2"></input>
                </div>
                </>
                }

                {
                isSuccess && 
                <div className="flex flex-col gap-4 text-center">
                    <Iconify icon="simple-line-icons:check" className="mx-auto inline-flex text-3xl text-green"/>
                    <div className="text-green font-bold text-center">Tokens Locked!</div>
                    <div>Check network for confirmation....</div>
                    <a target="_blank" href={txData?.url} className="p-4 truncate ... border text-xs rounded-md border-green text-green hover:bg-green/10">{txData?.txId}</a>
                </div>
                }

                {
                    !isSuccess && !isApproved && amountToLockWei > 0 &&

                    <Button
                        onClick={approveLock}
                       className="w-full"
                       variant="primary"
                       busy={isApproving || approveIsConfirming}
                    >
                        <span>{ approveIsConfirming ? 'Confirming...' : isApproving ? 'Approving...' : 'Approve Lock' }</span>
                    </Button>
                }

                { !isSuccess && isApproved && amountToLockWei > 0 &&
                    <Button
                        variant="secondary"
                        onClick={lockToken}
                        className="w-full"
                        busy={isPending}
                    >
                        <span>{ isPending ? 'Locking...' : 'Create Lock' }</span>
                    </Button>
                }

                {/* </div> */}
            </div>

        </div>);
}

export default CreateLock;