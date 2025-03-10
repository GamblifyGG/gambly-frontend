import { useEffect, useState, useContext } from "react";
import { motion } from 'framer-motion'
import { parse } from 'uuid'
import { formatUnits, parseUnits } from "viem";

import CompleteWithdrawalButton from "./CompleteWithdrawalButton";
import { Circle, Modal } from "../common";
import { Button } from "../form";
import { BaseContext } from '@/context/BaseContext'
import { requestWithdrawal, getUserTokenTransactions } from '@/api'
import toNetworkImg from '@/utils/convertNetworkToImage'
import { toast } from 'react-toastify'
import { getApiError } from "@/utils/api"

const toastOpts = { theme: "colored", position: "bottom-right", progress: false, closeButton: false }

const WithdrawalModal = ({ withdrawal, setShowModalWithdrawal }) => {
    const [amountToWithdraw, setAmountToWithdraw] = useState(0);
    const [validAmount, setValidAmount] = useState(false);
    const [loading, setLoading] = useState(false);
    const [withdrawalRequestSuccess, setWithdrawalRequestSuccess] = useState(false);
    const [withdrawalDetails, setWithdrawalDetails] = useState(false);
    const [error, setError] = useState(null)
    const {user} = useContext(BaseContext)
    const [canRetry, setCanRetry] = useState(false)

    const parseDetails = (data) => {
        // const byteArray = parse(data.id);
        // const byteString = Buffer.from(byteArray);
        // const transactionId = '0x' + byteString.toString('hex')
        console.log("DATA", data, withdrawal)
        const details = {
            token_2022: withdrawal?.casino?.token_2022,
            depositContractAddress: withdrawal?.token?.network?.deposit_contract_address,
            transactionId: data.id,
            amount: data.amount.replace('-', ''),
            recipient: user?.wallet_address,
            token: withdrawal?.token?.address,
            signature: data.signature,
            message: data.message,
            networkID: withdrawal?.token?.network?.id,
            isSolana: withdrawal?.token?.network?.id === 101,
            isEvm: withdrawal?.token?.network?.id !== 101,
        }

        console.log('[D]', details)
        setWithdrawalRequestSuccess(true)
        setWithdrawalDetails(details)
    }

    const retry = async () => {
        const [er, data] = await getUserTokenTransactions(
            withdrawal?.token?.network?.id,
            withdrawal?.token?.address,
        {})

        if (data) {
            const d = data.transactions?.find(x => x.amount[0] == '-' && !x.completed)
            if (d) parseDetails(d)
        }
    }

    const reqWithdrawal = async () => {
        setLoading(true)
        setWithdrawalRequestSuccess(false)
        setError(null)
        setCanRetry(false)
        console.log("WITHDRAWAL", withdrawal)
        const args = {
            chainId: withdrawal?.token?.network?.id,
            tokenAddress: withdrawal?.token?.address,
            amount: parseUnits(amountToWithdraw.toString(), withdrawal?.token?.decimals).toString()
        }

        console.log(args)

        const [er, data] = await requestWithdrawal(args)
        setLoading(false)

        if (data) {
            parseDetails(data.transaction)
            toast.success("Withdrawal request accepted", toastOpts)
        }

        if (er) {
            console.error('[WITHDRAW:ERR]', er)
            const msg = getApiError(er, "Error withdrawing!")
            setError(msg)
            toast.error(msg, toastOpts)
            setCanRetry(er?.error === 'WITHDRAWAL_PENDING')
        }
    }

    const reset = () => {
        setAmountToWithdraw(0)
        setLoading(false)
        setWithdrawalRequestSuccess(false)
        setWithdrawalDetails(false)
        setError(null)
    }

    useEffect(() => {
        console.log("Withdrawal", withdrawal)
        setAmountToWithdraw(0)
        setLoading(false)
        setError(null)
        setWithdrawalRequestSuccess(false)
    }, [])

    return (
    <Modal
        size="sm"
        isOpen={withdrawal !== false}
        onClose={() => {
            setShowModalWithdrawal(false)
            reset()
        }}
        header={<>
            <img className="h-6 w-auto" src={withdrawal?.token?.logo} alt="" />
            <span>Withdraw {withdrawal?.token?.symbol}</span>
        </>}
    >
        {withdrawalRequestSuccess === true &&
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="text-center py-4 text-primary flex flex-col items-center justify-center"
            >
                <div>Withdrawal Requested Successfully</div>
                <div className="text-dark-200 text-xs mb-4">You can complete the withdrawal by clicking the button below.</div>
                <CompleteWithdrawalButton {...withdrawalDetails} />
            </motion.div>
        }

        {loading === true && <div className="text-center text-primary animate-pulse max-h-20 flex flex-col items-center justify-center">
            <img src='/logo-letter.png' className="w-20 h-20" />
            Loading
        </div>
        }

        {withdrawalRequestSuccess === false && loading === false &&
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
            >
                { error &&
                    <div className="p-4 border text-xs mb-3 rounded-md border-red text-red flex items-center">{error}
                    { canRetry && <button onClick={retry} className="ml-auto text-dark py-1 px-3 bg-primary rounded-sm">Retry</button>}
                    </div> 
                }
                <div className="field mb-5 relative">
                    <div className="mb-2 text-dark-200 font-bold">Token Name</div>
                    <div className="absolute uppercase right-[15px] bottom-[10px] flex items-center gap-2 font-normal text-xs text-white">
                        <img width="10" src={toNetworkImg(withdrawal.token?.network?.id)} alt=""/>
                        <span>{withdrawal.token?.network?.name}</span>
                    </div>
                    <input disabled value={withdrawal.token?.name + "  " + withdrawal.token?.symbol || ""} min={0} className="disabled:opacity-50 w-full text-white rounded-sm border h-10 outline-none px-3 border-dark-260 focus:border-primary-500 bg-darkgray" />
                </div>

                <div className="field mb-5">
                    <div className="mb-2 text-dark-200 font-bold">Token Address</div>
                    <input disabled value={withdrawal.token?.address || ""} min={0} className="disabled:opacity-50 w-full text-white rounded-sm border h-10 outline-none px-3 border-dark-260 focus:border-primary-500 bg-darkgray" />
                </div>
                <div className="field mb-5">
                    <div className="mb-2 text-dark-200 font-bold">Amount Available</div>
                    <input disabled value={formatUnits(withdrawal?.balance || 0, withdrawal?.token?.decimals)} min={0} className="disabled:opacity-50 w-full text-white rounded-sm border h-10 outline-none px-3 border-dark-260 focus:border-primary-500 bg-darkgray" />
                </div>
                <div className="field mb-5">
                    <div className="mb-2 text-dark-200 font-bold">Amount To Withdraw</div>
                    <input onChange={(e) => {
                        setAmountToWithdraw(e.target.value)
                        let parsedAmt = parseUnits(e.target.value, withdrawal.token.decimals);
                        const bal = BigInt(withdrawal?.balance)
                        const isValid = parsedAmt > 0 && parsedAmt < bal
                        setValidAmount(isValid)
                    }} type="number" min={0} className={`w-full rounded-sm border h-10 outline-none px-3  bg-dark-700 ${validAmount === true ? "border-dark-260 focus:border-primary-500" : "border-red focus:border-red"}`} />
                </div>
                <Button
                    onClick={() => {
                        if (validAmount) {
                            reqWithdrawal()
                        }
                    }} 
                    className="w-full"
                    variant="primary"
                    disabled={!validAmount}
                    busy={loading}
                >Request Withdrawal</Button>
            </motion.div>
        }
    </Modal>);
}

export default WithdrawalModal;
