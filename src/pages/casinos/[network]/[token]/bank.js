import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Money, Icon } from '@/components/common';
import { Button } from '@/components/form';
import { motion } from 'framer-motion';
// import CoinHead from '@/components/coinflip/CoinHead';
import RPSHead from '@/components/rps/RpsHead';
import Link from 'next/link';
import { faArrowLeft, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertNetworkIDToSymbol, convertNetworkNameToId } from '@/utils/convertNetworkID';
import JoinGameModal from '@/components/rps/JoinGameModal';
import io from 'socket.io-client';
import authTokens from "@/utils/authTokens";
import useStateRef from 'react-usestateref';
import GameResult from "@/components/rps/GameResult"
import AvatarDarkBg from '@/components/AvatarDarkBg';
import DepositModal from '@/components/bank/DepositModal';
import WithdrawalModal from '@/components/bank/WithdrawalModal';
import { formatUnits } from 'viem';
// import DepositComp from '@/components/bank/DepositComp';
import { Modal } from '@/components/common';
import WithdrawalComp from '@/components/bank/WithdrawalComp';
import Transactions from '@/components/bank/Transactions';
import AppLoginButton from '@/components/AppLoginButton';
import AppLoginButtonNormal from '@/components/AppLoginButtonNormal';
import Login from '@/components/Login';
import LoginWindow from '@/components/loginwindow/LoginWindow';
import { SparklesCore } from '@/components/ui/sparkles';
// import { useWeb3Modal } from '@web3modal/wagmi/react'
import { BaseContext } from '@/context/BaseContext'
import Head from "next/head";




const Bank = () => {
    const router = useRouter();
    const [casino, setCasino] = useState(null);
    const [casinoError, setCasinoError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState('deposit');
    const [showDepositModal, setShowDepositModal] = useState(false);
    // const { open, close } = useWeb3Modal()
    const {token, user} = useContext(BaseContext)

    if (!token) {
        return <div className="flex items-center flex-col justify-center w-full h-full">
            <div className="flex items-center justify-center">
                <img src="/logo-letter.png" alt="Gambly" className="w-16 h-16" />
                <span className="text-xl font-bold">Loading...</span>
            </div>
        </div>
    }

    if (casinoError) {
        return <div className="flex items-center flex-col justify-center w-full text-red-500">
            {/* logo */}
            <div className="flex items-center justify-center">
                <img src="/logo-letter.png" alt="Gambly" className="w-16 h-16" />
            </div>
            {casinoError}
        </div>;
    }


    if (
        token && !user) {
        return (<div className='flex w-full items-center relative justify-center flex-col h-[calc(100%)] flex-grow'>
            <div className='flex items-center justify-center flex-col z-50'>
                <img alt="" src='/logo-letter.png' className='h-32' />
                <div onClick={() => {
                    // open()
                }} className="alert hover:opacity-70 cursor-pointer bg-primary text-gray p-4 rounded-full alert-danger font-extrabold text-xl">Please login to continue</div>
            </div>
            <div className='absolute w-[calc(100%)] h-[calc(100%)] top-0 left-0'>
                <SparklesCore particleColor={['#FFA843']} particleDensity={10} id={'test'} className={'h-full w-full'} background={'red'} ></SparklesCore>
            </div>
        </div>)
    }

    return (
        <div className="flex flex-col w-full bg-dark h-full">
            <Head>
                <title>Bank - Gambly</title>
            </Head>
            <header className="bg-darker p-4">
                <div className="w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <div onClick={() => setCurrentPage('deposit')} className={`flex h-10 items-center text-white shadow border border-bordergray bg-gray hover:bg-secondary hover:opacity-100 hover:text-dark transition-all px-3 py-2 rounded-md text-sm ${currentPage === 'deposit' ? 'bg-secondary' : ''}`}>
                                <div className="text-sm font-semibold">
                                    {token && (
                                        <div className="flex items-center">
                                            {token?.logo ? (
                                                <img
                                                    src={token?.logo}
                                                    alt=""
                                                    className="w-4 h-4 mr-1 rounded-full"
                                                />
                                            ) : (
                                                <img
                                                    src={'/placeholder.png'}
                                                    alt=""
                                                    className="w-4 h-4 mr-1 rounded-full border border-bordergray"
                                                />
                                            )}
                                            <span className="text-xs font-semibold">Deposit {token?.symbol}</span>
                                        </div>
                                    )}</div>
                            </div>
                            <div onClick={() => setCurrentPage('withdraw')} className={`flex h-10 items-center text-white shadow border border-bordergray bg-gray hover:bg-secondary hover:opacity-100 hover:text-dark transition-all px-3 py-2 rounded-md text-sm ${currentPage === 'withdraw' ? 'bg-secondary' : ''}`}>
                                <div className="text-sm font-semibold">
                                    {casino && (
                                        <div className="flex items-center">
                                            {token?.logo ? (
                                                <img
                                                    src={token?.logo}
                                                    alt=""
                                                    className="w-4 h-4 mr-1 rounded-full"
                                                />
                                            ) : (
                                                <img
                                                    src={'/placeholder.png'}
                                                    alt=""
                                                    className="w-4 h-4 mr-1 rounded-full border border-bordergray"
                                                />
                                            )}
                                            <span className="text-xs font-semibold">Withdraw {token?.symbol}</span>
                                        </div>
                                    )}</div>
                            </div>
                            <div onClick={() => setCurrentPage('history')} className={`flex h-10 items-center text-white shadow border border-bordergray bg-gray hover:bg-secondary hover:opacity-100 hover:text-dark transition-all px-3 py-2 rounded-md text-sm ${currentPage === 'history' ? 'bg-secondary' : ''}`}>
                                <div className="text-sm font-semibold">
                                    {casino && (
                                        <div className="flex items-center">
                                            {token?.logo ? (
                                                <img
                                                    src={token?.logo}
                                                    alt=""
                                                    className="w-4 h-4 mr-1 rounded-full"
                                                />
                                            ) : (
                                                <img
                                                    src={'/placeholder.png'}
                                                    alt=""
                                                    className="w-4 h-4 mr-1 rounded-full border border-bordergray"
                                                />
                                            )}
                                            <span className="text-xs font-semibold">Transaction History </span>
                                        </div>
                                    )}</div>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </header>

            <div className="flex-grow h-full  px-4 pb-4 relative">
                {/* <RockPaperScissorsAnimation /> */}
                <div className="bg-darker  h-full border border-bordergray rounded-xl p-6 mb-8 flex flex-col">
                    {/* Player 1 */}
                    {/* <div className={`flex justify-between mt-6 md:mt-0 flex-col items-center`}>
                        <div className="flex flex-col items-center">
                            <div className="text-xl font-semibold">{currentPage === 'deposit' ? 'Deposit' : 'Withdraw'} {token?.symbol} on {convertNetworkIDToSymbol(token?.network?.id)} Network</div>
                        </div>
                    </div> */}
                    {currentPage === 'deposit' && (
                        <div className="flex-grow h-full w-full">
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <div className="bg-dark-700 h-full rounded-lg p-6 w-full max-w-md">
                                    {/* <DepositComp selectedToken={casino} selectedTokenAddress={token?.address} selectedTokenName={token?.name} selectedTokenNetworkID={token?.network?.id} selectedTokenDecimals={token?.decimals} selectedTokenLogo={token?.logo || '/placeholder.png'} selectedTokenDepositContractAddress={token?.network?.deposit_address} /> */}
                                </div>
                            </div>
                        </div>
                    )}
                    {currentPage === 'withdraw' && (
                        <div className="flex-grow h-full w-full">
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <div className="bg-dark-700 h-full rounded-lg p-6 w-full max-w-md">
                                    {/* <WithdrawalComp
                                        withdrawal={casino}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    )}
                    {currentPage === 'history' && (
                        <Transactions />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Bank;