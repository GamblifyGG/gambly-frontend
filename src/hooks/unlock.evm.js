import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { parseContractError } from "@/utils/contracts";
import { getExplorerLink, devLog } from "@/utils/common";
import LockABI from "@/abis/TokenTimeLock.json";
import { parse } from 'uuid'

export function useEvmUnlock({
  lockId,
  token
}) {
  const byteArray = parse(lockId);
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

  const switchNetwork = async () => {
    console.log("Switch Network")
    try {
        await switchChainAsync({ chainId: token?.network?.id })
    } catch (error) {
        console.error(error)
    }
}

  async function unlock() {
    try {

        setShortError(null)

        devLog('[chainId, tokenNetwork]', [chainId, token?.network?.id])
        if (chainId !== Number(token?.network?.id)) {
          await switchNetwork()
        }

        const config = {
            address: token?.network?.lock_contract_address,
            abi: LockABI,
            functionName: 'unlock',
            args: [idHex],
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

  return { unlock, shortError, isPending, data, txData, isSuccess, isError }
}
