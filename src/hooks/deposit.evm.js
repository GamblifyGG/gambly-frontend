import { useEffect, useState } from "react";
import { erc20Abi } from "viem";
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { parseContractError } from "@/utils/contracts";
import { getExplorerLink } from "@/utils/common";
import CasinoBankABI from "@/abis/CasinoBank.abi.json";
import { devLog, awaiter } from "@/utils/common"
import { toast } from 'react-toastify'

const toastOpts = { theme: "colored", position: "bottom-right", progress: false, closeButton: false }

export function useEvmDeposit({
  token,
  amount,
}) {
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [shortError, setShortError] = useState(null)
  const [txData, setTxData] = useState(null)
  const { chainId, address } = useAccount()
  const { switchChainAsync } = useSwitchChain()

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

  // Deposit
  const {
      isPending: depositIsPending,
      isError: depositIsError,
      isSuccess: depositIsSuccess,
      error: depositError,
      writeContractAsync: depositFunc,
      reset: resetDeposit,
      data: depositData,
  } = useWriteContract()

  // Allowance
  const {
      error: allowanceError,
      data: allowanceData,
      isError: allowanceIsError,
      isSuccess: allowanceIsSuccess,
      isPending: allowanceIsPending,
      refetch: allowanceFunc,
  } = useReadContract({
      address: token?.address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, token?.network?.deposit_contract_address],
  })

  const {
    isLoading: approveConfirmIsPending,
    isSuccess: approveConfirmIsSuccess,
    isError: approveConfirmIsError
  } = useWaitForTransactionReceipt({ hash: approveData })

  const {
    isLoading: depositIsConfirming,
    isSuccess: depositIsConfirmed,
    isError: depositIsConfirmError
  } = useWaitForTransactionReceipt({ hash: depositData })

  const switchNetwork = async () => {
    console.log("Switch Network")
    try {
        await switchChainAsync({ chainId: token?.network?.id })
    } catch (error) {
        console.error(error)
    }
  }

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

  const approve = async () => {
    try {
        // First check allowance
        setIsApproving(true)
        setShortError(null)
        devLog('Approving...')

        devLog('[chainId, tokenNetwork]', [chainId, token.network.id])

        if (chainId !== Number(token.network.id)) {
          await switchNetwork()
        }

        const [er1, allowed] = await awaiter(checkAllowance())
        if (er1) throw er1

        if (allowed) {
            setIsApproved(true)
            setIsApproving(false)
            return
        }

        // Needs approval
        resetApprove()
        const [er2, data2] = await awaiter(approveFunc({
            address: token?.address,
            abi: erc20Abi,
            functionName: 'approve',
            args: [token?.network?.deposit_contract_address, String(amount)],
        }))

        if (er2) throw er2

        devLog('[APPROVE]', data2)
    } catch (err) {
        console.error('[APPROVE]', err)
        const msg = parseContractError(err, 'Approval failed!')
        setIsApproved(false)
        setIsApproving(false)
        setShortError(msg)
        toast.error(msg, toastOpts)
    }
  }

  const deposit = async () => {
    try {
      setShortError(null)
      const config = {
          address: token?.network?.deposit_contract_address,
          abi: CasinoBankABI,
          functionName: 'deposit',
          args: [token?.address, String(amount)],
      }

      resetDeposit()
      await depositFunc(config)
      toast.success("Deposit sent. Wait for confirmation!", toastOpts)
    } catch (err) {
      console.error(err)
      const msg = parseContractError(err, 'Error depositing tokens!')
      setShortError(msg)
      toast.error(msg, toastOpts)
    }
  }

  useEffect(() => {
    if (!depositData) return
    setTxData({
      txId: depositData,
      url: getExplorerLink(depositData, chainId) 
    })
  }, [depositData])

  useEffect(() => {
    if (allowanceIsSuccess) {
      setIsApproved(true)
      setIsApproving(false)
      toast.success(`${token?.symbol} Approved!`, toastOpts)
    }
  }, [approveConfirmIsSuccess])

  useEffect(() => {
    if (approveConfirmIsError) {
      setIsApproved(false)
      setIsApproving(false)
      toast.error("Approval confirmation failed!", toastOpts)
    }
  }, [approveConfirmIsError])

  const resetAll = () => {
    resetDeposit()
    resetApprove()
    setIsApproved(false)
    setIsApproving(false)
  }

  return { 
    approve,
    deposit,
    resetAll,
    allowanceIsPending,
    approveConfirmIsPending,
    approveConfirmIsSuccess,
    approveIsPending,
    depositIsConfirmed,
    depositIsConfirmError,
    depositIsConfirming,
    depositIsError,
    depositIsPending,
    depositIsPending,
    depositIsSuccess,
    isApproved,
    isApproving,
    shortError,
    txData,
  }
}
