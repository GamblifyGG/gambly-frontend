import useStateRef from "react-usestateref";
import { useEffect, useState, useContext, useRef } from "react";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { toast } from 'react-toastify'

import { Button } from "@/components/form";
import { Iconify, Modal } from "@/components/common";
import { useEvmDeposit } from "@/hooks/deposit.evm";
import { useSolanaDeposit } from "@/hooks/deposit.solana";
import { BaseContext } from '@/context/BaseContext';
import { convertNetworkID } from "@/utils/convertNetworkID";
import convertNetworkToImage from "@/utils/convertNetworkToImage";
import { devLog } from "@/utils/common"
import { useRouter } from "next/router";
import WrongNetworkNotice from "@/components/WrongNetworkNotice"

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay]);

  return debouncedValue;
}

const DepositModal = ({ showModal, setShowModal }) => {
    const [inputValue, setInputValue] = useState('');
    const debouncedSearchTerm = useDebounce(inputValue, 500); // 500ms delay
    const [searching, setSearching] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);

    const [tokens, setTokens] = useState([]);
    const [selectedToken, setSelectedToken] = useState(null);
    const [depositAmount, setDepositAmount] = useState(0);
    const [depositAmountWei, setDepositAmountWei, depositAmountWeiRef] = useStateRef(0);

    const { chainId } = useAccount()
    const { searchTokens, userAuth, token, depositToken, setDepositToken, network } = useContext(BaseContext)
    const [isSolana, setIsSolana] = useState(false)
    const [isEvm, setIsEvm] = useState(false)

    const router = useRouter()

    const { 
      approveConfirmIsPending: evmApproveIsConfirming,
      approveConfirmIsSuccess: evmApproveIsConfirmed,
      depositIsConfirmed: evmIsConfirmed,
      depositIsConfirming: evmIsConfirming,
      depositIsError: evmIsError,
      depositIsPending: evmIsPending,
      depositIsSuccess: evmIsSuccess,
      isApproved: evmIsApproved,
      isApproving: evmIsApproving,
      txData: evmTxData,
      approve: evmApprove,
      deposit: evmDeposit,
      resetAll: evmResetDeposit,
    } = useEvmDeposit({ token: selectedToken, amount: depositAmountWei })

    const {
      reset: solanaReset,
      deposit: solanaDeposit,
      isPending: solanaIsPending,
      isSuccess: solanaIsSuccess,
      isError: solanaIsError,
      txData: solanaTxData
    } = useSolanaDeposit({ amount: depositAmountWei, token: selectedToken })

    const startSearch = (keywords) => {
      setSearching(true);

      searchTokens(keywords, userAuth?.chainId, true)
        .then(r => {
          setTokens(r)
        })
        .finally(()=> {
          setSearching(false)
        })
    }

    const search = (e) => {
      let value = typeof e === "string" ? e : e.target.value;
      setInputValue(value);
      setSearchVisible(true);
      setSearching(true);
      setTokens([]);

      if (value.length > 0) {
        setSearching(true);
      } else {
        setSelectedToken(null);
        setSearching(false);
        setSearchVisible(false);
      }
    }

    const reset = () => {
      setSelectedToken(null)
      setTokens([])
      setDepositAmount(0)
      setInputValue("")
      evmResetDeposit()
      solanaReset()
    }

    useEffect(() => {
      if (debouncedSearchTerm) {
        // Perform the search operation or API call here
        startSearch(debouncedSearchTerm)
        devLog('Search for:', debouncedSearchTerm);
      }
    }, [debouncedSearchTerm]);

    useEffect(() => {
      setIsSolana(selectedToken ? selectedToken?.network?.id === 101 : false)
      setIsEvm(selectedToken ? selectedToken?.network?.id !== 101 : false)
    }, [selectedToken])

    useEffect(() => {
      if (showModal && depositToken) {
        setSelectedToken(depositToken)
        setInputValue(depositToken?.address)
      }
    }, [showModal, depositToken])

    const approveTokens = () => {
      if (isEvm) evmApprove()
    }

    const depositTokens = () => {
      if (isEvm) evmDeposit()
      if (isSolana) solanaDeposit()
    }

    return (
      <Modal
        size="sm"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setDepositToken(null)
          reset()
        }}
        header={<>
          <img className="w-auto h-[20px]" src={network?.logo} alt="" />
          <span className="capitalize">Deposit {network?.name} Tokens</span>
        </>}
      >
        <WrongNetworkNotice token={selectedToken} />

        { (!evmIsSuccess && !solanaIsSuccess) && 
          <>
            <div className="mb-2 font-medium">Token Address</div>
            <div className="relative mb-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => search(e)}
                placeholder={`Search ${convertNetworkID(userAuth?.chainId)} tokens...`}
                className="h-10 text-sm outline-none w-full px-4 pr-10 rounded-lg border border-dark-260 focus:border-primary-500 bg-dark-700"
              />

              { inputValue.length > 0 &&
              <Button onClick={() => search("")} size="icon-xs" className="absolute right-2 top-2">
                <Iconify icon="mingcute:close-fill" className="text-red"/>
              </Button>
              }

              { inputValue.length > 0 && !selectedToken &&
              <div className="w-full overflow-auto p-2 max-h-[200px] rounded-lg bg-gray border border-lightgray">
                { searching &&
                  <div className="flex items-center justify-center">
                    <span>Searching Tokens...</span>
                  </div>
                }

                { !searching && tokens.length == 0 &&
                  <div className="flex items-center justify-center">
                    <span>No matches found on {convertNetworkID(userAuth?.chainId)}!</span>
                  </div>
                }
                          
                { tokens.length > 0 &&
                    tokens.map((token, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          devLog("Setting token", token);
                          setSelectedToken(token);
                          setInputValue(token?.address);
                        }}
                        className="items-center flex border-lightgray justify-between  cursor-pointer opacity-95 even:bg-gray p-2 rounded-md overflow-auto odd:bg-darkgray"
                      >
                        <div className="grid grid-cols-2">
                          <div className="text-sm truncate">{token?.name}</div>
                          <div className="text-sm">${token?.symbol}</div>
                          <div className="col-start-1 col-end-4 text-xs">{token?.address}</div>
                        </div>

                        <div className="text-sm flex justify-end relative">
                          {token?.logo ?
                            <img src={token?.logo} className="h-8 rounded-full object-cover w-8"></img> :
                            <div className="h-8 w-8 rounded-full bg-darkgray border border-lightgray flex items-center justify-center">?</div>
                          }
                            <img src={convertNetworkToImage(token?.network?.id)} className="h-5 -right-1 bg-darkgray border-lightgray border p-1 -top-1 rounded-full absolute object-contain w-5"/>
                        </div>
                      </div>
                    ))
                  }
              </div>
              }
            </div>
          </>
        }

        { !evmIsSuccess && !solanaIsSuccess && selectedToken &&
          <div>
            <div className="mb-2">
              <div className="font-medium mb-2">Token</div>
              <div className="relative">
                <input placeholder="N/A" className="h-10 outline-none w-full px-4 w-fullw-full rounded-lg border border-dark-260 focus:border-primary-500 bg-darkgray cursor-not-allowed" value={`${selectedToken?.name} (${selectedToken?.symbol})`} disabled />
                <img
                  src={selectedToken?.logo}
                  className="h-[20px] w-auto absolute right-4 bottom-[10px]" alt=""
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-2 font-medium">Amount</div>
              <input
                  onChange={(e) => {
                      let v = e.target.value;
                      if (v > 0) {
                          setDepositAmount(v || 0)
                          let depositedAmountWei = parseUnits(v, selectedToken?.decimals)
                          setDepositAmountWei(depositedAmountWei || 0)
                      } else {
                          setDepositAmount(0)
                          setDepositAmountWei(0)
                      }
                  }}
                  type="number"
                  min={0}
                  placeholder="Amount to deposit"
                  className="h-10 outline-none w-full px-4 w-fullw-full rounded-lg border border-dark-260 focus:border-primary-500 bg-dark-700"
              />
            </div>
          </div>
        }

        {
          (evmIsSuccess || solanaIsSuccess) && selectedToken &&
          <div className="flex flex-col gap-4 text-center">
              <Iconify icon="simple-line-icons:check" className="mx-auto inline-flex text-3xl text-green"/>
              <div className="text-green font-bold text-center">Deposit Sent!</div>
              <div>Check network for confirmation....</div>
              <a target="_blank" href={isEvm ? evmTxData?.url : solanaTxData?.url } className="p-4 truncate ... border text-xs rounded-md border-green text-green hover:bg-green/10">{isEvm ? evmTxData?.txId : solanaTxData?.txId }</a>
          </div>
        }

        { depositAmountWei > 0 && isEvm && !evmIsApproved && !evmIsSuccess && selectedToken &&
          <Button
            variant="primary"
            className="w-full"
            onClick={approveTokens}
            busy={evmIsApproving}
          >
            { evmApproveIsConfirming ? 'Confirming...' : evmIsApproving ? 'Approving...' : `Approve ${depositAmount} ${selectedToken?.symbol}` }
          </Button>
        }

        { depositAmountWei > 0 && isEvm && evmIsApproved && !evmIsSuccess && selectedToken &&
          <Button
            variant="secondary"
            className="w-full"
            onClick={depositTokens}
            busy={evmIsPending || evmIsConfirming}
          >
            { evmIsConfirming ? 'Confirming...' : evmIsPending ? 'Depositing...' : `Deposit ${depositAmount} ${selectedToken?.symbol}` }
          </Button>
        }

        { depositAmountWei > 0 && isSolana && !solanaIsSuccess && selectedToken &&
          <Button
            variant="secondary"
            className="w-full"
            onClick={depositTokens}
            busy={solanaIsPending}
          >
            { solanaIsPending ? 'Depositing...' : `Deposit ${depositAmount} ${selectedToken?.symbol}` }
          </Button>
        }

{/* { !success && selectedToken && selectedToken?.network?.id != 101 && selectedToken?.network?.id != chainId && 
                <div className="flex gap-2 py-3">
                    <Iconify icon="ri:refresh-line" className="text-primary inline-flex items-center animate-spin"/>
                    <div>
                    Switching network from <span className="font-bold text-primary capitalize">{convertNetworkID(chainId)}</span> to <span className="font-bold text-primary capitalize">{convertNetworkID(selectedToken?.network?.id)}</span>...
                    <div>Please change manually if this fails</div>
                    </div>
                </div>
            } */}




        </Modal>);
}

export default DepositModal;
