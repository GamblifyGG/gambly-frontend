import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { useConnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { BaseContext } from "@/context/BaseContext";
import UserWindow from "./UserWindow";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton, useWalletModal } from "@solana/wallet-adapter-react-ui";
const LoginWindow = () => {
    const { isLoginWindowOpen, user, setIsLoginWindowOpen, isConnected, userLoading, isConnectingUser, isSigningMessage, setEvmLoginOpen, setSolanaLoginOpen } = useContext(BaseContext);
    const { open: openAppKit } = useAppKit()
    // const { wallet: solanaWallet, connected } = useWallet()
    const { setVisible: openSolanaWalletModal, visible: isSolanaWalletModalOpen } = useWalletModal()
    // on escape button close the login window
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsLoginWindowOpen(false)
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [setIsLoginWindowOpen]);



    if (isConnected) return null;
    if (isLoginWindowOpen === false) return null;




    const handleConnect = (type) => {
        if (type === 'evm') {
            setEvmLoginOpen(true)
            openAppKit()
        } else if (type === 'solana') {
            setSolanaLoginOpen(true)
            openSolanaWalletModal(true)
            // Implement Solana connection logic here
            console.log("[SOLANA] Connecting to Solana wallet...");
        }
    }

    return (
        <div
            className='fixed z-[900] top-0 flex items-center justify-center flex-col w-full h-[100%] backdrop-blur-md p-4'
            onClick={() => setIsLoginWindowOpen(false)}
        >
            <div
                className="flex flex-col w-full sm:w-[400px] md:w-[400px] lg:w-[400px] border p-10 rounded-md border-bordergray bg-dark h-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {user && <UserWindow />}
                {!user && <>
                    {isConnectingUser === true && isLoginWindowOpen === true && <div className="flex items-center justify-center">
                        <span className="text-lightgray text-xl">Connecting to wallet...</span>
                    </div>}


                    {isSigningMessage === true && isLoginWindowOpen === true && <div className="flex items-center justify-center">
                        <span className="text-lightgray text-xl">Signing message, please check your wallet...</span>
                    </div>}

                    {userLoading === true && isLoginWindowOpen === true && <div className="flex items-center justify-center">
                        <span className="text-lightgray text-xl">Loading user data...</span>
                    </div>}



                    {!isConnectingUser && !isSigningMessage && !userLoading && isLoginWindowOpen === true && <div className="flex flex-col">
                        <div className="flex items-center justify-center">
                            <img src='/logo-letter.png' alt='Reown' className="w-10 h-10 mr-2" />
                            <span className="text-lightgray text-xl">Connect your wallet</span>
                        </div>
                    </div>}
                    {/* solana or evm networks */}
                    {!isConnectingUser && !isSigningMessage && !userLoading && isLoginWindowOpen === true && <div className="flex flex-col">
                        <div className="mt-6 space-y-4">
                            <button
                                onClick={() => handleConnect('evm')}
                                className="w-full hover:border-primary flex-col border border-bordergray  p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition duration-300"
                            >
                                <div className="flex items-center justify-center">
                                    EVM Chains/Wallets
                                </div>
                                <div className="text-xs text-lightgray flex items-center justify-center mt-2">
                                    <img src="/chains/eth.svg" alt="ETH" className="w-4 h-4 mr-2" />
                                    <img src="/chains/binance.svg" alt="BSC" className="w-4 h-4 mr-2" />
                                    <img src="/chains/avalanche.svg" alt="BASE" className="w-4 h-4 mr-2" />
                                    {/* <img src="/chains/arbitrum.svg" alt="ARBITRUM" className="w-4 h-4 mr-2" /> */}
                                    <img src="/chains/polygon.svg" alt="POLYGON" className="w-4 h-4 mr-2" />
                                </div>
                            </button>
                            <div className="text-center w-full text-secondary h-[1px] bg-bordergray"></div>
                            <button
                                onClick={() => handleConnect('solana')}
                                className="w-full hover:border-primary flex-col border border-bordergray  p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition duration-300"
                            >
                                <div className="flex items-center justify-center">
                                    Solana Wallets
                                </div>
                                <div className="text-xs text-lightgray flex items-center justify-center mt-2">
                                    <img src="/chains/solana.svg" alt="Solana" className="w-4 h-4 mr-2" />
                                    {/* <WalletMultiButton /> */}
                                </div>
                            </button>
                        </div>
                    </div>
                    }
                </>}

                <div className="flex items-center justify-center mt-4">
                    <button
                        onClick={() => setIsLoginWindowOpen(false)}
                        className="w-full hover:border-primary flex-col border border-bordergray  p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition duration-300"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div >
    );
}

export default LoginWindow;