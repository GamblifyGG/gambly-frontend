import { getLayout } from '@/components/CasinoLayout'
import { Button, Tbox } from '@/components/form'
import { useContext, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faDownLong, faMagnifyingGlass, faMoneyBillTransfer, faVial } from '@fortawesome/free-solid-svg-icons'
import { useAccount } from 'wagmi'
import Head from "next/head";

import dynamic from 'next/dynamic'
import { SparklesCore } from '@/components/ui/sparkles'
import Investments from '@/components/bank/Staking'
import PleaseLogin from "@/components/PleaseLogin"

const Transactions = dynamic(() => import('@/components/bank/Transactions'))
const DepositModal = dynamic(() => import('@/components/bank/DepositModal'))
const Balances = dynamic(() => import('@/components/bank/Balances'))
const WithdrawalModal = dynamic(() => import('@/components/bank/WithdrawalModal'))

// Custom hook for debouncing

import { BaseContext } from "@/context/BaseContext";


const Poker = () => {
    const [showModal, setShowModal] = useState(false)
    const [showModalWithdrawal, setShowModalWithdrawal] = useState(false)
    const [showModalBalances, setShowModalBalances] = useState(false)
    const router = useRouter();
    const [socket, setSocket] = useState(null);

    const [casino, setCasino] = useState(null);
    const [casinoError, setCasinoError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState('Transactions');

    // context
    const { } = useContext(BaseContext);


    // const { open, close } = useWeb3Modal()
    const { address, isConnecting, isDisconnected } = useAccount()

    const { user, userAuth, userLoading, setShowDepositModal, showDepositModal } = useContext(BaseContext);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.page) {
            if (router.query.page === 'transactions') {
                setCurrentPage('Transactions')
            } else if (router.query.page === 'balances') {
                setCurrentPage('Balances')
            } else if (router.query.page === 'transactions' && router.query.type === 'deposit') {
                setCurrentPage('Deposit')
            }
        }
    }, [router.isReady, router.query.page]);

    // router query change
    useEffect(() => {
        if (!router.isReady) return;
        if (!router.query.page) {
            setCurrentPage('Transactions')
            console.log("No page")
        }
        console.log("router.query", router.query.page)
        if (router.query.page === 'transactions' && router.query.type === 'deposit') {
            console.log("Deposit Page loaded")
            setCurrentPage('Transactions')
            setShowDepositModal(true)
        } else if (router.query.page === 'transactions') {
            setCurrentPage('Transactions')
        } else if (router.query.page === 'balances') {
            setCurrentPage('Balances')
        } else if (router.query.page === 'investments') {
            setCurrentPage('Investments')
        } else {
            setCurrentPage('Transactions')
        }

    }, [router.query.page, router.isReady]);

    if (!userAuth) return <PleaseLogin />

    return (
        <>
            <Head>
                <title>Bank - Gambly</title>
            </Head>

            <WithdrawalModal withdrawal={showModalWithdrawal} setShowModalWithdrawal={setShowModalWithdrawal} />

            {!user && !userLoading &&
                <div className='flex w-full items-center relative justify-center flex-col h-[calc(100%)] flex-grow'>
                    <div className='flex items-center justify-center flex-col z-50'>
                        <img alt="" src='/logo-letter.png' className='h-32' />
                        <div onClick={() => {
                            // open()
                        }} className="alert hover:opacity-70 cursor-pointer bg-primary text-gray p-4 rounded-full alert-danger font-extrabold text-xl">Please login to continue</div>
                    </div>
                    <div className='absolute w-[calc(100%)] h-[calc(100%)] top-0 left-0'>
                        <SparklesCore particleColor={['#FFA843']} particleDensity={10} id={'test'} className={'h-full w-full'} background={'red'} ></SparklesCore>
                    </div>
                </div>
            }

            {userLoading &&
                <div className='cont h-full flex items-center justify-center'>
                    <Loading />
                </div>
            }

            {casinoError ?
                <div className='cont flex items-center justify-center flex-col'>
                    <img alt="" src='/logo-letter.png' className='h-32 animate-pulse' />
                    <div className="alert alert-danger font-extrabold text-xl">{casinoError} </div>
                </div>
                :

                user &&
                <div className="p-4 max-w-[1100px] mx-auto">
                    <div className="flex items-center justify-center lg:justify-between">
                        <div className="gap-4 items-center lg:flex hidden">
                            <div className="bg-primary w-4 h-4 rounded-full"></div>
                            <span className="text-drak-200 text-xs flex items-center gap-1">
                                <FontAwesomeIcon icon={faMoneyBillTransfer}></FontAwesomeIcon>
                                <span>Bank</span>
                            </span>
                        </div>
                        <div className='flex gap-2'>
                            <Button variant="primary-outline" data-active={currentPage === 'Transactions'} onClick={() => {
                                router.push(`/bank?page=transactions`)
                            }}>
                                Transactions
                            </Button>
                            <Button variant="primary-outline" data-active={currentPage === 'Investments'} onClick={() => {
                                router.push(`/bank?page=investments`)
                            }}>
                                Staking
                            </Button>
                            <Button variant="primary-outline" data-active={currentPage === 'Balances'} onClick={() => {
                                router.push(`/bank?page=balances`)
                            }}>
                                - Withdraw
                            </Button>

                            <Button variant="primary-outline" data-active={showDepositModal === true} onClick={() => setShowDepositModal(true)}>
                                + Deposit
                            </Button>

                        </div>
                    </div>
                    {currentPage === 'Transactions' &&
                        <Transactions setPage={setCurrentPage} />
                    }

                    {currentPage === 'Balances' &&
                        <Balances setShowModalWithdrawal={setShowModalWithdrawal} />
                    }

                    {currentPage === 'Investments' &&
                        <Investments />
                        // <Balances setShowModalWithdrawal={setShowModalWithdrawal} />
                    }

                </div>
            }


        </>
    )
}

Poker.getLayout = getLayout

export default Poker