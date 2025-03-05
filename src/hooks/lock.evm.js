import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useReadContract, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { parseContractError } from "@/utils/contracts";
import { getExplorerLink, awaiter, devLog } from "@/utils/common";
import LockABI from "@/abis/TokenTimeLock.json";
import { parse, v4 } from 'uuid'
import { erc20Abi } from 'viem'

export function useEvmLock({
  lockContractAddress,
  token,
  amount, 
}) {
  const id = v4()
  const byteArray = parse(id);
  const byteString = Buffer.from(byteArray);
  const idHex = '0x' + byteString.toString('hex')

  const { switchChainAsync } = useSwitchChain()
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [shortError, setShortError] = useState(null)
  const [txData, setTxData] = useState(null)
  const { chainId, address } = useAccount()

  // Lock
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

  // Approve
  const {
    isPending: approveIsPending,
    isError: approveIsError,
    isSuccess: approveIsSuccess,
    error: approveError,
    failureReason: approveFailure,
    data: approveData,
    writeContractAsync: approveFunc,
    reset: resetApprove,
} = useWriteContract()

  // Allowance
  const {
    error: allowanceError,
    data: allowanceData,
    isError: allowanceIsError,
    isSuccess: allowanceIsSuccess,
    isPending: allowanceIsPending,
    refetch: allowanceFunc
} = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address, lockContractAddress],
})


const checkAllowance = async () => {
  return new Promise(async (resolve, reject) => {
      allowanceFunc().then((allowance) => {
          console.log("Allowance", allowance)
          if (allowance.data >= Number(amount)) {
              resolve(true)
          } else {
              resolve(false)
          }
      }).catch((err) => {
          console.log("Error checking allowance", err)
          reject(err)
      })
  })
}
  const switchNetwork = async () => {
    console.log("Switch Network")
    try {
        await switchChainAsync({ chainId: token?.network?.id })
    } catch (error) {
        console.error(error)
    }
  }

const approveLock = async () => {
  try {
      setIsApproving(true)
      
      devLog('[chainId, tokenNetwork]', [chainId, token?.network?.id])
      if (chainId !== Number(token?.network?.id)) {
        await switchNetwork()
      }

      const [er1, allowed] = await awaiter(checkAllowance())
      if (er1) throw er1

      if (allowed) {
          setIsApproved(true)
          return
      }

      // Needs approval
      resetApprove()
      const [er2, data2] = await awaiter(approveFunc({
          address: token.address,
          abi: erc20Abi,
          functionName: 'approve',
          args: [lockContractAddress, String(amount)],
      }))

      if (er2) throw er2

      devLog(data2)
  } catch (err) {
      console.error(err)
      const msg = err?.shortMessage || err?.message || 'Approval failed!'
      setIsApproved(false)
  } finally {
    setIsApproving(false)
  }
}

  async function lockToken() {
    try {
        setShortError(null)

        devLog('[chainId, tokenNetwork]', [chainId, token?.network?.id])
        if (chainId !== Number(token.network.id)) {
          await switchNetwork()
        }

        const config = {
            address: lockContractAddress,
            abi: LockABI,
            functionName: 'lock',
            args: [idHex, amount],
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

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError
  } = useWaitForTransactionReceipt({ hash: data })

  const {
    isLoading: approveIsConfirming,
    isSuccess: approveIsConfirmed,
    isError: approveIsConfirmError
  } = useWaitForTransactionReceipt({ hash: approveData })

  useEffect(() => {
    if (approveIsConfirmed) setIsApproved(true)
  }, [approveIsConfirmed])

  const resetAll = () => {
    resetApprove()
    reset()
  }

  return {
    lockToken,
    approveLock,
    shortError,
    isPending,
    txData,
    isSuccess,
    isError,
    approveError,
    isApproving,
    isApproved,
    isConfirmed,
    isConfirming,
    isConfirmError,
    approveIsConfirming,
    approveIsConfirmed,
    approveIsConfirmError,
    resetAll
  }
}
