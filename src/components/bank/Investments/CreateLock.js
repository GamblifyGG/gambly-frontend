'use client'

import { faLock, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSwitchChain, useWriteContract, useReadContract, useChainId } from "wagmi";
import { useEffect, useState, useContext } from "react";
import { useAccount } from "wagmi";
import { formatUnits, parseUnits } from "viem";
// import { useEvmLock } from "@/hooks/lock.evm";
import { Iconify } from "@/components/common";
import { Button } from "@/components/form"
import LogoLetter from "../../../../public/logo-letter.png"
import Image from "next/image"
import { BaseContext } from "@/context/BaseContext"
import { createLock } from "@/api/lock"
const CreateLock = () => {
    const { switchChainAsync, isError: switchNetworkError, isSuccess: isSuccessSwitchNetwork } = useSwitchChain()

    const [amountToLock, setAmountToLock] = useState(0)
    const [amountToLockWei, setAmountToLockWei] = useState(0)
    const [allowance, setAllowance] = useState(0)
    const [endDate, setEndDate] = useState(0)
    const { balances } = useContext(BaseContext)
    const [balance, setBalance] = useState(0)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const address = 'znv3FZt2HFAvzYf5LxzVyryh3mBXWuTRRng25gEZAjh';

    useEffect(() => {
        const token = balances.find(b => b.token.address === address)
        if (token) {
            setBalance(token.balance)
            setToken(token.token)
        }
    }, [balances])


    useEffect(() => {
        let endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 2)
        setEndDate(endDate.toDateString())
    }, [])
    const lockToken = () => {
        setIsPending(true)
        console.log(amountToLockWei)
        createLock({ amount: amountToLockWei }).then((res) => {
            console.log(res)
            if (res[1].message) {
                if (res[1].message === "Lock created successfully") {
                    setIsSuccess(true)
                    setIsPending(false)
                } else {
                    setIsError(true)
                    setIsPending(false)
                }
            } else {
                setIsError(true)
                setIsPending(false)
            }
        }).catch((err) => {
            console.log(err)
            setIsPending(false)
            setIsError(true)
        })
    }

    return (
        <div className="h-full p-4 flex w-full flex-col gap-4">
            <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                    <div className="items-center flex gap-2">
                        <Image src={LogoLetter} alt="" width={20} height={20} />
                        <span>Create a new lock</span>
                    </div>

                    <div className="flex items-center relative justify-center">
                        <FontAwesomeIcon icon={faLock} className="text-[16px]"></FontAwesomeIcon>
                        <FontAwesomeIcon icon={faPlusCircle} className="text-green left-2 bg-white rounded-full absolute text-[10px]"></FontAwesomeIcon>
                    </div>
                </div>
                <span className="text-xs text-lightgray">Lock your tokens for a certain period of time and earn a percentage of all the sites profits.</span>
            </div>

            <div className="flex flex-col gap-2 h-full">
                {!isSuccess &&
                    <>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">Lock Amount <div className="flex ml-2 items-center border border-bordergray rounded-md p-1">Balance: {formatUnits(balance, token?.decimals)}  <Image src={LogoLetter} className="h-full h-4 w-4" alt="" /></div></div>
                            <input onChange={(e) => {
                                let value = e.target.value
                                if (value < 0) {
                                    value = 0
                                }
                                if (value > balance) {
                                    value = formatUnits(balance, token?.decimals)
                                }
                                if (value > 0) {
                                    setAmountToLock(value)
                                    setAmountToLockWei(parseUnits(value, token?.decimals))
                                } else {
                                    setAmountToLock(0)
                                    setAmountToLockWei(0)
                                }
                            }} type="number" value={amountToLock} className="border bg-dark outline-none border-bordergray rounded-md p-2"></input>
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
                        <Iconify icon="simple-line-icons:check" className="mx-auto inline-flex text-3xl text-green" />
                        <div className="text-green font-bold text-center">Tokens Locked!</div>
                    </div>
                }

                <Button
                    variant="secondary"
                    onClick={lockToken}
                    className="w-full"
                    busy={isPending}
                >
                    <span>{isPending ? 'Locking...' : 'Lock Tokens'}</span>
                </Button>



            </div>

        </div>);
}

export default CreateLock;