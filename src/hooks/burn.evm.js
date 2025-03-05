import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { parseContractError } from "@/utils/contracts";
import { getExplorerLink, devLog } from "@/utils/common";
import CasinoBankABI from "@/abis/CasinoBank.abi.json";
import { parse } from 'uuid'

export function useEvmBurn({
  depositContractAddress,
  transactionId, 
  amount, 
  token, 
  signature,
  networkID
}) {
  const byteArray = parse(transactionId);
  const byteString = Buffer.from(byteArray);
  const idHex = '0x' + byteString.toString('hex')
  const recipient = "0x000000000000000000000000000000000000dead"

  // console.log({
  //   depositContractAddress,
  //   transactionId, 
  //   amount, 
  //   token, 
  //   signature,
  //   networkID,
  //   recipient
  // })

  const { switchChainAsync } = useSwitchChain()
  const [shortError, setShortError] = useState(null)
  const [txData, setTxData] = useState(null)
  const { chainId } = useAccount()
  const {
      isPending,
      isError,
      isSuccess,
      error,
      failureReason,
      data,
      writeContractAsync,
      reset,
      status,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError
  } = useWaitForTransactionReceipt({ hash: data })

  const switchNetwork = async () => {
    console.log("Switch Network")
    try {
        await switchChainAsync({ chainId: networkID })
    } catch (error) {
        console.error(error)
    }
}

  async function burn() {
    try {

        setShortError(null)

        devLog('[chainId, tokenNetwork]', [chainId, networkID])
        if (chainId !== Number(networkID)) {
          await switchNetwork()
        }

        const config = {
            address: depositContractAddress,
            abi: CasinoBankABI,
            functionName: 'withdraw',
            args: [idHex, amount, recipient, token, signature],
        }
        
        await writeContractAsync(config)
    } catch (error) {
        console.log('[ER]', parseContractError(error))
        console.log(error)
        setShortError(parseContractError(error))
    }
  }

  useEffect(() => {
    if (!data) return
    setTxData({
      txId: data,
      url: getExplorerLink(data, chainId) 
    })
  }, [data])

  return {
    burn,
    reset,
    shortError,
    isPending,
    data,
    txData,
    isSuccess,
    isError,
    isConfirmError,
    isConfirmed,
    isConfirming
  }
}
