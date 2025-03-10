import { useEffect, useState } from "react";
import { useSolanaWithdrawal } from '@/hooks/withdraw.solana'
import { useEvmWithdrawal } from '@/hooks/withdraw.evm'
import { Iconify } from "@/components/common"
import { Button } from "@/components/form"

const CompleteWithdrawalButton = ({
    token_2022,
    depositContractAddress,
    transactionId, 
    amount, 
    recipient, 
    token, 
    signature,
    message,
    networkID,
    isEvm,
    isSolana,
    onDone = () => {}
}) => {
    const {
        txData: solanaTxData,
        isPending: solanaIsPending,
        shortError: solanaError,
        withdraw: processSolanaWithdrawal,
        isSuccess: solanaIsSuccess,
        isError: solanaIsError
    } = useSolanaWithdrawal({ 
        token_2022,
        depositContractAddress,
        transactionId,
        amount,
        token,
        signature,
        message,
        networkID
    })

    const {
        txData: evmTxData,
        isPending: evmIsPending,
        shortError: evmError,
        withdraw: processEvmWithdrawal,
        isSuccess: evmIsSuccess,
        isError: evmIsError,
    } = useEvmWithdrawal({
        depositContractAddress,
        transactionId, 
        amount, 
        recipient, 
        token, 
        signature,
        message,
        networkID,
    })

    useEffect(() => {
        // console.log("SOLANA TX DATA", solanaTxData)
        // console.log("EVM TX DATA", evmTxData)
        console.log("TOKEN 2022", token_2022)
    }, [token_2022])

    return (<>
        { !solanaIsSuccess && !evmIsSuccess &&
            <Button
                busy={networkID == 101 ? solanaIsPending : evmIsPending }
                variant="secondary"
                className="text-dark mb-4"
                onClick={() => networkID == 101 ? processSolanaWithdrawal() : processEvmWithdrawal()}
            >   
                { (evmIsPending || solanaIsPending) ? "Processing..." : "Complete Withdrawal"}
            </Button>
        }

        { (evmIsSuccess || solanaIsSuccess) && <>
            <hr className="block w-full border border-t border-lightgray mb-4"/>
            <div className="text-green mb-1 font-semibold flex items-center gap-2"><Iconify icon="icon-park-outline:check-one" className="text-xl"/>Withdrawal sent!</div>
            <p className="text-sm text-white mb-4">Check network for confirmation...</p>
        </>}

        { solanaTxData && 
            <a target="_blank" href={solanaTxData.url} className="block p-4 truncate max-w-full overflow-hidden whitespace-nowrap border text-xs rounded-md border-green text-green hover:bg-green/10">{solanaTxData.txId}</a>
        }

        { evmTxData && 
            <a target="_blank" href={evmTxData.url} className="block p-4 truncate max-w-full overflow-hidden whitespace-nowrap border text-xs rounded-md border-green text-green hover:bg-green/10">{evmTxData.txId}</a>
        }

        {
            solanaIsError &&
            <div className="text-red">Error processing withdrawal
                <div className="p-2 break-before-auto break-all text-xs">{solanaError}</div>
            </div>
        }

        {
            evmIsError &&
            <div className="text-red">Error processing withdrawal
                <div className="p-2 break-before-auto break-all text-xs">{evmError}</div>
            </div>
        }
    </>);
}

export default CompleteWithdrawalButton;
