import { useEffect, useState } from "react";
import { useSolanaBurn } from '@/hooks/burn2.solana'
import { useEvmBurn } from '@/hooks/burn.evm'
import { Modal } from "@/components/common";

const CompleteWithdrawalButton = ({
    transactionId, 
    amount, 
    token, 
    signature,
    message,
    onDone = () => {}
}) => {

    const [showModal, setShowModal] = useState(false)
    const isSolana = token?.network?.id === 101
    const isEvm = !isSolana

    const {
        txData: solanaTxData,
        isPending: solanaIsPending,
        shortError: solanaError,
        burn: processSolanaBurn,
        isSuccess: solanaIsSuccess,
        isError: solanaIsError,
    } = useSolanaBurn({ 
        depositContractAddress: token?.network?.deposit_contract_address,
        transactionId,
        amount,
        token: token?.address,
        signature,
        message,
        networkID: token?.network?.id
    })

    const {
        txData: evmTxData,
        isPending: evmIsPending,
        shortError: evmError,
        burn: processEvmBurn,
        isSuccess: evmIsSuccess,
        isError: evmIsError,
        reset: evmReset,
    } = useEvmBurn({
        depositContractAddress: token?.network?.deposit_contract_address,
        transactionId, 
        amount, 
        token: token?.address, 
        signature,
        message,
        networkID: token?.network?.id,
    })

    const reset = () => {

    }

    return (<>
        { !solanaIsSuccess && !evmIsSuccess &&
            <button
                className="bg-secondary text-bordergray hover:opacity-75 cursor-pointer p-2 rounded-md mt-2"
                onClick={() => {
                    setShowModal(true)
                    setTimeout(()=> {
                        if (isSolana) {
                            processSolanaBurn()
                        } else {
                            processEvmBurn()
                        }
                    }, 500)
                }}
            >Complete Burn</button>
        }


        <Modal
            size="sm"
            isOpen={showModal}
            onClose={() => {
                evmReset()
                setShowModal(false) 
            }}
            header={<span className="text-lg">Burn {token?.symbol} Tokens</span>}
        >
            <div>
            { (evmIsPending || solanaIsPending) && <div className="text-primary">Processing...</div> }

{ (evmIsSuccess || solanaIsSuccess) && <div className="text-primary mb-4">Processed successfully</div>}

{ solanaTxData && 
    <a target="_blank" href={solanaTxData.url} className="block p-4 truncate max-w-full overflow-hidden whitespace-nowrap border text-xs rounded-md border-green text-green hover:bg-green/10">{solanaTxData.txId}</a>
}

{ evmTxData && 
    <a target="_blank" href={evmTxData.url} className="block p-4 truncate max-w-full overflow-hidden whitespace-nowrap border text-xs rounded-md border-green text-green hover:bg-green/10">{evmTxData.txId}</a>
}

{
    solanaIsError &&
    <div className="text-red">Error processing
        <div className="p-2 break-before-auto break-all text-xs">{solanaError}</div>
    </div>
}

{
    evmIsError &&
    <div className="text-red">Error processing
        <div className="p-2 break-before-auto break-all text-xs">{evmError}</div>
    </div>
}
            </div>
        </Modal>
    </>);
}

export default CompleteWithdrawalButton;
