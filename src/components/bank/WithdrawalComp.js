import { useContext, useEffect, useState } from "react";
import { Circle, Modal } from "../common";
import { Button, Tbox } from "../form";
import { convertNetworkID } from "@/utils/convertNetworkID";
import Loading from "../Loading";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatUnits, parseUnits } from "viem";
import CompleteWithdrawalButton from "./CompleteWithdrawalButton";

const WithdrawalComp = ({ withdrawal, setShowModalWithdrawal }) => {
    useEffect(() => {
        console.log("Withdrawal", withdrawal)
    }, [withdrawal])
    const router = useRouter();

    const [amountToWithdraw, setAmountToWithdraw] = useState(0);
    const [validAmount, setValidAmount] = useState(false);
    const [loading, setLoading] = useState(false);
    const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
    const [withdrawalRequestSuccess, setWithdrawalRequestSuccess] = useState(false);
    const [withdrawalDetails, setWithdrawalDetails] = useState(false);
    const [myBalance, setMyBalance] = useState(0);
    const requestWithdrawal = async () => {
        setWithdrawalSuccess(false)
        setLoading(true);
        return new Promise(async (resolve, reject) => {
            let accessToken = localStorage.getItem('token');
            let refreshToken = localStorage.getItem('refreshToken');

            if (!accessToken || !refreshToken) {
                reject('Invalid access token or refresh token, please login again');
            }
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/requestWithdrawal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken,
                    refreshToken,
                    tokenAddress: withdrawal.TokenAddress,
                    networkID: withdrawal.NetworkID,
                    amount: amountToWithdraw
                })
            })
            const response = await res.json()
            if (response.error) {
                alert(response.message)
            } else {
                if (response.success || response.error === false) {
                    // setWithdrawalSuccess(true)
                    console.log("Withdrawal Requested Successfully", response)
                    setWithdrawalDetails(response)
                    setWithdrawalRequestSuccess(true)
                    resolve();
                }
            }
            setLoading(false)
        })
    }

    const reset = () => {
        setAmountToWithdraw(0)
        setLoading(false)
        setWithdrawalSuccess(false)
        setWithdrawalRequestSuccess(false)
        setWithdrawalDetails(false)
    }

    useEffect(() => {
        console.log("Withdrawal", withdrawal)
        // find my balance for this token

        // my balance
        let myBalance = 0;

        // userSettingsRef.current.balances.forEach(token => {
        //     if (token.TokenAddress === withdrawal.TokenAddress) {
        //         myBalance = token.TokenAmount;
        //     }
        // })

        setMyBalance(myBalance)
        // const myBalance = userSettingsRef.current.find(token => token.address === withdrawal.TokenAddress)?.balance;
        // console.log("My Balance", myBalance)
        setAmountToWithdraw(0)
        setLoading(false)
        setWithdrawalSuccess(false)
    }, [])

    return (<div>


        {withdrawalRequestSuccess === true &&
            // web3 
            <div className="text-center text-primary h-auto flex flex-col items-center justify-center">
                <div>Withdrawal Requested Successfully</div>
                <div className="text-dark-200 text-xs">You can complete the withdrawal by clicking the button below.</div>
                <div onClick={() => {
                    // setShowModalWithdrawal(false)
                    // router.push('/bank?page=transactions')
                }}>
                    {withdrawalDetails &&
                        <CompleteWithdrawalButton
                            depositContractAddress={withdrawalDetails.DepositContractAddress}
                            transactionId={withdrawalDetails.InternalID}
                            amount={withdrawalDetails.TokenAmount}
                            walletAddress={withdrawalDetails.WalletAddress}
                            tokenAddress={withdrawalDetails.TokenAddress}
                            signature={withdrawalDetails.Signature}
                            networkID={withdrawalDetails.NetworkID}
                        />
                    }
                </div>
            </div>
        }

        {withdrawalSuccess === true &&
            <div className="text-center text-primary max-h-20 flex flex-col items-center justify-center">
                <div>Withdrawal Requested Successfully</div>
                <div className="text-dark-200 text-xs">It can take up to 15 minutes for your transaction to be sent by our servers.</div>
                <div onClick={() => {
                    setShowModalWithdrawal(false)
                    router.push('/bank?page=transactions')
                }}>
                    <span className="text-primary-500">View Transactions</span>
                </div>
            </div>
        }

        {loading === true && <div className="text-center text-primary animate-pulse max-h-20 flex flex-col items-center justify-center">
            <img src='/logo-letter.png' className="w-20 h-20" />
            Loading
        </div>
        }

        {withdrawalSuccess === false && loading === false && withdrawalRequestSuccess === false &&
            <div>
                <div className="field mb-5">
                    <div className="mb-2 text-dark-200">Token Name | Symbol</div>
                    <input disabled value={withdrawal.TokenName + " | " + withdrawal.TokenSymbol || ""} min={0} className="w-full text-white rounded-sm border h-10 outline-none px-2 border-dark-260 focus:border-primary-500 bg-darkgray" />
                </div>

                <div className="field mb-5">
                    <div className="mb-2 text-dark-200">Token Address</div>
                    <input disabled value={withdrawal.TokenAddress || ""} min={0} className="w-full text-white rounded-sm border h-10 outline-none px-2 border-dark-260 focus:border-primary-500 bg-darkgray" />
                </div>
                <div className="field mb-5">
                    <div className="mb-2 text-dark-200">Network</div>
                    <input disabled value={convertNetworkID(withdrawal.NetworkID) || ""} min={0} className="w-full text-white rounded-sm border h-10 outline-none px-2 border-dark-260 focus:border-primary-500 bg-darkgray" />
                </div>
                <div className="field mb-5">
                    <div className="mb-2 text-dark-200">Amount Available</div>
                    <input disabled value={formatUnits(myBalance || 0, withdrawal?.TokenDecimals)} min={0} className="w-full text-white rounded-sm border h-10 outline-none px-2 border-dark-260 focus:border-primary-500 bg-darkgray" />
                </div>
                <div className="field mb-5">
                    <div className="mb-2 text-dark-200">Amount To Withdraw</div>
                    <input onChange={(e) => {
                        setAmountToWithdraw(e.target.value)
                        if (e.target.value === '') {
                            setValidAmount(false)
                        }

                        let number = Number(e.target.value)
                        console.log(number)
                        if (isNaN(number) || number === 0) {
                            setValidAmount(false)
                        } else {
                            let parsedAmt = parseUnits(e.target.value, withdrawal.TokenDecimals);
                            if (parsedAmt > withdrawal.TokenAmount) {
                                setValidAmount(false)
                            } else {
                                setValidAmount(true)
                            }
                        }
                    }} type="number" min={0} className={`w-full rounded-sm border h-10 outline-none px-2  bg-dark-700 ${validAmount === true ? "border-dark-260 focus:border-primary-500" : "border-red focus:border-red"}`} />
                </div>
                <Button onClick={() => {
                    if (validAmount) {
                        requestWithdrawal()
                    }
                }} className={`w-full ${!validAmount ? 'cursor-not-allowed' : ''}`} variant={validAmount ? 'primary' : 'dark'}>Request Withdrawal</Button>
            </div>
        }
    </div>);
}

export default WithdrawalComp;