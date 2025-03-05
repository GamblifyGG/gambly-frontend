// import convertNetworkToImage from "@/utils/convertNetworkToImage";
// import { useEffect, useState } from "react";
// import useStateRef from "react-usestateref";
// import { erc20ABI, useAccount, useContractRead, useContractWrite, useNetwork, useSwitchNetwork } from "wagmi";
// import { Button } from "../form";
// import CasinoBankABI from "../../abis/CasinoBank.abi.json";
// import { Circle, Modal } from "../common";
// import { ethers } from "ethers";
// import axios from "axios";
// import { convertNetworkID } from "@/utils/convertNetworkID";
// import { parseUnits } from "viem";



// function useDebounce(value, delay) {
//     const [debouncedValue, setDebouncedValue] = useState(value);

//     useEffect(() => {
//         // Set debouncedValue to value after the specified delay
//         const handler = setTimeout(() => {
//             setDebouncedValue(value);
//         }, delay);

//         // Cleanup function
//         return () => {
//             clearTimeout(handler);
//         };
//     }, [value, delay]);

//     return debouncedValue;
// }


// const DepositComp = ({ selectedToken, selectedTokenAddress, selectedTokenName, selectedTokenNetworkID, selectedTokenDecimals, selectedTokenLogo, selectedTokenDepositContractAddress }) => {

//     const [inputValue, setInputValue] = useState('');

//     const debouncedSearchTerm = useDebounce(inputValue, 500); // 500ms delay

//     const { switchNetwork, isError: switchNetworkError, isSuccess: isSuccessSwitchNetwork } = useSwitchNetwork()

//     const { chain, chains } = useNetwork()
//     const [tokens, setTokens] = useState([]);
//     // const [selectedToken, setSelectedToken] = useState(null);
//     // const [selectedTokenName, setSelectedTokenName] = useState(null);
//     // const [selectedTokenAddress, setSelectedTokenAddress] = useState(null);
//     const [depositAmount, setDepositAmount] = useState(0);
//     const [depositAmountWei, setDepositAmountWei, depositAmountRef] = useStateRef(0);
//     const [depositProcess, setDepositProcess] = useState(1);
//     const { address, account, chainId } = useAccount()
//     const [buttonLoading, setButtonLoading] = useState(false);
//     const [searching, setSearching] = useState(false);
//     const [searchVisible, setSearchVisible] = useState(false);


//     const { data: approveData, isLoading: approveIsLoading, isError: isApproveError, isSuccess: approveIsSuccess, write: writeFunction, reset: resetContractWrite } = useContractWrite({
//         address: selectedTokenAddress,
//         abi: erc20ABI,
//         functionName: 'approve',
//         args: [selectedToken?.DepositContractAddress, String(depositAmountRef.current)],
//     })

//     // use contract write to deposit to depositorContract
//     const { isError: isDepositError, isSuccess: isDepositSuccess, write: deposit, reset: resetDeposit } = useContractWrite({
//         address: selectedToken?.DepositContractAddress,
//         abi: CasinoBankABI,
//         functionName: 'deposit',
//         args: [selectedToken?.TokenAddress, String(depositAmountRef.current)],
//     })
//     // use contract read to read the allowance

//     const { data: allowanceData, isLoading: allowanceIsLoading, isSuccess: allowanceIsSuccess, read: readAllowance, refetch } = useContractRead({
//         address: selectedTokenAddress,
//         abi: erc20ABI,
//         functionName: 'allowance',
//         args: [address, selectedToken?.DepositContractAddress],
//     })
//     useEffect(() => {
//         if (switchNetworkError) {
//             setDepositProcess(2)
//             setButtonLoading(false);
//         }
//     }, [switchNetworkError])


//     useEffect(() => {
//         if (isSuccessSwitchNetwork) {
//             setButtonLoading(false);
//             checkAllowance().then((allowance) => {
//                 if (allowance === true) {
//                     setDepositProcess(4);
//                 } else {
//                     setDepositProcess(3);
//                 }
//             }).catch((err) => {
//                 console.log("Error checking allowance", err)
//                 setDepositProcess(3);
//                 setButtonLoading(false);
//             })
//         }
//     }, [isSuccessSwitchNetwork])

//     useEffect(() => {
//         if (selectedTokenAddress && selectedTokenAddress != null) {
//             if (isApproveError) {
//                 setDepositProcess(3)
//                 setButtonLoading(false);
//             }
//         }
//     }, [isApproveError])

//     useEffect(() => {
//         if (isDepositError) {
//             setDepositProcess(4)
//             setButtonLoading(false);
//         }
//     }, [isDepositError])

//     useEffect(() => {
//         if (approveIsSuccess) {
//             setDepositProcess(4)
//             setButtonLoading(false);
//         }
//     }, [approveIsSuccess])

//     const startSearch = (keywords) => {
//         // axios call to get token via address
//         setSearching(true);
//         let comletedText = process.env.NEXT_PUBLIC_BACKEND_URL + '/search/' + keywords;
//         console.log("Searcfhing: ", comletedText)
//         axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/search/' + keywords).then((res) => {
//             console.log(res.data);
//             setTokens(res.data);
//         }).catch((err) => {
//         }).finally(() => {
//             setSearching(false);
//         })
//     }
//     const search = (e) => {
//         let value = e.target.value;
//         setInputValue(value);
//         setSearchVisible(true);
//         setSearching(true);
//         setTokens([]);
//         if (value.length > 0) {
//             if (ethers.utils.isAddress(value)) {
//                 value = ethers.utils.getAddress(value);
//                 setSearching(true);
//             } else {
//                 console.log("Invalid address", value)
//                 setSearching(false);
//             }
//         } else {
//             setSelectedToken(null);
//             setSelectedTokenAddress(null);
//             setSelectedTokenName(null);
//             setSearching(false);
//             setSearchVisible(false);
//             setDepositProcess(1);
//         }
//     }

//     // deposit functions
//     const data = useContractRead({
//         abi: erc20ABI,
//         functionName: 'allowance',
//         args: [address, selectedToken?.DepositContractAddress],
//     })
//     const checkAllowance = async () => {
//         return new Promise(async (resolve, reject) => {
//             refetch().then((allowance) => {
//                 console.log("Allowance", allowance.data)
//                 if (allowance.data >= Number(depositAmountWei)) {
//                     resolve(true)
//                 } else {
//                     resolve(false)
//                 }
//             }).catch((err) => {
//                 console.log("Error checking allowance", err)
//                 reject(err)
//             })
//         })
//     }
//     const switchChainsOrContinue = async () => {
//         return new Promise(async (resolve, reject) => {
//             setButtonLoading(true);
//             { chain && <div>Connected to {chain.name}</div> }
//             // check if we're connected to the right network
//             if (selectedToken?.NetworkID != Number(chain.id)) {
//                 try {
//                     console.log("Switching networks")
//                     await switchNetwork(selectedToken?.NetworkID)
//                 } catch (error) {
//                     console.log("Error switching networks", error)
//                 }
//             } else {
//                 console.log("Correct network")
//                 // set the deposit process to 3
//                 checkAllowance().then((allowance) => {
//                     if (allowance === true) {
//                         setDepositProcess(4);
//                     } else {
//                         setDepositProcess(3);
//                     }
//                 }).catch((err) => {
//                     console.log("Error checking allowance", err)
//                     setDepositProcess(3);
//                     setButtonLoading(false);
//                 })
//             }
//         })
//     }
//     const approveTokensForDeposit = async () => {
//         setButtonLoading(true);
//         resetContractWrite();
//         try {
//             await writeFunction()
//             setDepositProcess(4);
//         } catch (error) {
//             console.log("Error approving tokens", error)
//         }
//     }
//     const depositTokens = async () => {
//         setButtonLoading(true);
//         console.log("Depositing tokens", selectedToken)
//         console.log(selectedTokenAddress);
//         console.log('[TOKEN]', selectedToken)
//         console.log(selectedToken?.network?.DepositContractAddress);
//         // resetDeposit();
//         try {
//             await deposit()
//         } catch (error) {
//             console.log("Error depositing tokens", error)
//         }
//     }

//     // Search functions
//     useEffect(() => {
//         if (debouncedSearchTerm) {
//             // Perform the search operation or API call here
//             startSearch(debouncedSearchTerm)
//             console.log('Search for:', debouncedSearchTerm);
//         }
//     }, [debouncedSearchTerm]);

//     return (
//         <div>

//             <div>Token Address</div>
//             <div className='relative'>
               
//             </div>
//             {selectedToken &&
//                 <div>
//                     <div className='mt-2'>
//                         <div>Token Name</div>
//                         <div className='grid grid-cols-[1fr_0.2fr] items-center justify-center'>
//                             <input type='search' placeholder='N/A' className='h-10 outline-none w-full px-4 w-fullw-full rounded-sm border border-dark-260 focus:border-primary-500 bg-darkgray cursor-not-allowed' value={selectedTokenName} disabled></input>
//                             <div className='flex items-center justify-center'>
//                                 {selectedToken?.TokenLogo ?

//                                     <img src={selectedToken?.TokenLogo} className='h-8 rounded-full object-cover w-8'></img> :
//                                     <div className='h-8 w-8 rounded-full bg-darkgray border border-lightgray flex items-center justify-center'>?</div>
//                                 }
//                             </div>
//                         </div>
//                     </div>
//                     <div className='mt-2'>
//                         <div>Token Symbol</div>
//                         <input type='search' placeholder='N/A' className='h-10 outline-none w-full px-4 w-fullw-full rounded-sm border border-dark-260 focus:border-primary-500 bg-darkgray cursor-not-allowed' value={"$" + selectedToken?.TokenSymbol} disabled></input>
//                     </div>

//                     <div className='mt-2'>
//                         <div>Network</div>
//                         <input type='search' placeholder='N/A' className='h-10 outline-none w-full px-4 w-fullw-full rounded-sm border border-dark-260 focus:border-primary-500 bg-darkgray cursor-not-allowed' value={convertNetworkID(selectedToken?.NetworkID)} disabled></input>
//                     </div>
//                 </div>
//             }

//             {depositProcess === 1 &&
//                 selectedToken &&
//                 <>
//                     <div className='mt-4'>Amount to deposit</div>
//                     <input onChange={(e) => {
//                         let v = e.target.value;
//                         if (v > 0) {
//                             setDepositAmount(v || 0)
//                             let depositedAmountWei = parseUnits(v, selectedToken?.TokenDecimals || 18)
//                             setDepositAmountWei(depositedAmountWei || 0)
//                         } else {
//                             setDepositAmount(0)
//                             setDepositAmountWei(0)
//                         }
//                     }} type='number' min={0} placeholder='Amount to deposit' className='h-10 outline-none w-full px-4 w-fullw-full rounded-sm border border-dark-260 focus:border-primary-500 bg-dark-700'></input>

//                     {depositAmount > 0 ?
//                         <Button onClick={() => {
//                             if (selectedToken?.NetworkID != Number(chain.id)) {
//                                 setDepositProcess(2);
//                             } else {
//                                 checkAllowance().then((allowance) => {
//                                     console.log("Allowance", allowance)
//                                     if (allowance === true) {
//                                         setDepositProcess(4);
//                                         setButtonLoading(false);
//                                     } else {
//                                         setDepositProcess(3);
//                                         setButtonLoading(false);
//                                     }
//                                 }).catch((err) => {
//                                     console.log("Error checking allowance", err)
//                                     setDepositProcess(3);
//                                     setButtonLoading(false);
//                                 })
//                             }
//                         }} className="w-full mt-4 bg-darkgray self-end place-self-end">Deposit ${selectedToken?.TokenSymbol} now!</Button>
//                         :
//                         <Button variant='dark' className="w-full mt-4 self-end place-self-end cursor-not-allowed">Deposit ${selectedToken?.TokenSymbol}</Button>
//                     }
//                 </>
//             }

//             {depositProcess === 2 &&
//                 selectedToken &&
//                 <>
//                     {buttonLoading === false &&
//                         <Button onClick={async () => {
//                             await switchChainsOrContinue().then(() => {
//                                 checkAllowance().then((allowance) => {
//                                     if (allowance === true) {
//                                         setDepositProcess(4);
//                                     } else {
//                                         setDepositProcess(3);
//                                     }
//                                 }).catch((err) => {
//                                     console.log("Error checking allowance", err)
//                                     setDepositProcess(3);
//                                     setButtonLoading(false);
//                                 })
//                             }).catch((err) => {
//                                 console.log("Error switching networks", err)
//                                 setButtonLoading(false);
//                                 alert("Error switching networks")
//                             })
//                         }} className="w-full mt-4 self-end place-self-end">Switch to {convertNetworkID(selectedToken?.NetworkID)} network</Button>
//                     }
//                 </>
//             }


//             {depositProcess === 3 &&
//                 <>
//                     {buttonLoading === false &&
//                         <Button onClick={() => {
//                             approveTokensForDeposit()
//                         }} className="w-full mt-4 self-end place-self-end">Approve {String(depositAmount)} {selectedToken?.TokenSymbol}</Button>
//                     }
//                 </>
//             }


//             {depositProcess === 4 &&
//                 <>
//                     {buttonLoading === false &&
//                         <Button onClick={() => {
//                             depositTokens()
//                         }} className="w-full mt-4 self-end place-self-end">Deposit {String(depositAmount)} {selectedToken?.TokenSymbol}</Button>
//                     }
//                 </>
//             }

//             {buttonLoading &&
//                 <div className='flex items-center justify-center mt-2'>
//                     <div className="flex justify-center items-center">
//                         <div className="flex items-center">
//                             <img src="/logo-letter.png" alt="G" className="block w-8 h-8" />
//                             <div className="text-sm font-bold">Loading...</div>
//                         </div>
//                     </div>
//                 </div>
//             }
//         </div>);
// }

// export default DepositComp;