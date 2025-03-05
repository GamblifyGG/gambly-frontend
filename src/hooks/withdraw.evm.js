import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { parseContractError } from "@/utils/contracts";
import { getExplorerLink, devLog } from "@/utils/common";
import CasinoBankABI from "@/abis/CasinoBank.abi.json";
import { parse } from 'uuid'
import { toast } from 'react-toastify'

const toastOpts = { theme: "colored", position: "bottom-right", progress: false, closeButton: false }

export function useEvmWithdrawal({
  depositContractAddress,
  transactionId, 
  amount, 
  recipient, 
  token, 
  signature,
  networkID
}) {
  const byteArray = parse(transactionId);
  const byteString = Buffer.from(byteArray);
  const idHex = '0x' + byteString.toString('hex')

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
      const msg = parseContractError(error, "Error switching networks!")
      toast.error(msg, toastOpts)
    }
}

  async function withdraw() {
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
        toast.success("Withdrawal Processed!", toastOpts)
    } catch (error) {
      console.error(error)
      const msg = parseContractError(error)
      setShortError(msg)
      toast.error(msg, toastOpts)
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
    withdraw,
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
