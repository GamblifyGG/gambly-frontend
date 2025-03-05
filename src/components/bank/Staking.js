import { faStackExchange } from "@fortawesome/free-brands-svg-icons";
import { faClockRotateLeft, faEye, faHourglassHalf, faLock, faMoneyBillTrendUp, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useContext } from "react";
import useStateRef from "react-usestateref";
import UpcomingPayouts from "./Investments/UpcomingPayouts";
import MyPayouts from "./Investments/MyPayouts";
import MyLocks from "./Investments/MyLocks";
import CreateLock from "./Investments/CreateLock";
import axios from "axios";
import { formatEther, parseEther } from "viem";
import PastPayouts from "./Investments/PastPayouts";
import { getUserStakingPayouts, getUserStaking, getUserStakingLocks } from '@/api'
import { BaseContext } from '@/context/BaseContext'


const Investments = () => {


        const [buttonsHover, setButtonsHover, buttonsHoverRef] = useStateRef({
                newLock: false,
                withdraw: false,
                myLocks: false,
                upcomingpayouts: false,
                pastpayouts: false,
                myPayouts: false
        })


        const [currentPage, setCurrentPage] = useState('MyPayouts');
        const [pastPayouts, setPastPayouts] = useState([]);
        const [myPayouts, setMyPayouts] = useState([]);
        const [upcomingPayouts, setUpcomingPayouts] = useState([]);
        const [myPercentage, setMyPercentage] = useState(0);
        const [myStakeAmount, setMyStakeAmount] = useState(0);
        const [totalStaked, setTotalStaked] = useState(0);
        const [totalPaidOutInUSD, setTotalPaidOutInUSD] = useState(0);
        const [nextPayoutTime, setNextPayoutTime] = useState(0);

        const [lockContractAddress, setLockContractAddress] = useState('');
        const [lockContractToken, setLockContractToken] = useState('');
        const [locks, setLocks] = useState({
                totalLocked: 0,
                userLocked: 0,
                percentageLocked: 0,
                userLocks: []
        });

        const [payouts, setPayouts] = useState([])
        const [staking, setStaking] = useState({
                locks: {
                        locked: "0",
                        unlocked: "0",
                        share: 1
                },
                payouts: {
                        total: 0,
                        usd_total: 0
                }
        })

        const { balances } = useContext(BaseContext)
        const [balance, setBalance] = useState(0)
        const [locksLoading, setLocksLoading] = useState(false)

        const refreshLocks = async () => {
                setLocksLoading(true)
                const [er, data] = await getUserStakingLocks({})
                setLocksLoading(false)

                if (data) {
                        if (data) setLocks(prev => ({...prev, userLocks: data.locks}))
                }
        }


        async function fetchStakingData() {
                const [[er1, data1], [er2, data2], [er3, data3]] = await Promise.all([
                        getUserStaking(),
                        getUserStakingLocks({}),
                        getUserStakingPayouts({})
                        ]);

                if (data1) setStaking(data1)
                if (data2) setLocks(prev => ({...prev, userLocks: data2.locks}))
                if (data3) setPayouts(data3.payouts)

                if (balances.length) {
                        // const lockable = balances.filter(x => x.token?.network?.lock_contract_address)
                        const lockable = balances.filter(x => x.token?.symbol === 'WEENUS')
                        console.log('[LOCKABLE]', lockable)

                        if (lockable.length) {
                                // Fix address
                                lockable[0].token.address = "0x7439E9Bb6D8a84dd3A23fe621A30F95403F87fB9"
                                setLockContractToken(lockable[0].token)
                                setBalance(lockable[0].balance)
                        }
                }
        }


        useEffect(()=> {
                if (!balances.length) return
                fetchStakingData()
        }, [balances])

        useEffect(() => {
                if (currentPage === "MyLocks") {
                        refreshLocks()
                }
        }, [currentPage])

        return (
                <div className='h-full flex flex-col lg:flex-row p-0 gap-4 mt-4 pb-4'>
                        <div className="w-full lg:w-1/3 flex flex-col gap-2">
                                <div className="grid-cols-5 flex-col w-full gap-2 lg:grid-cols-3 grid lg:px-2 h-20 rounded-md">
                                        <div
                                                onMouseEnter={() => setButtonsHover({ ...buttonsHoverRef.current, myPayouts: true })}
                                                onMouseLeave={() => setButtonsHover({ ...buttonsHoverRef.current, myPayouts: false })}
                                                onClick={() => setCurrentPage('MyPayouts')}
                                                className={`flex relative hover:cursor-pointer hover:opacity-75 rounded-md transition-all items-center flex-col justify-center border border-bordergray ${currentPage === 'MyPayouts' ? 'bg-primary text-dark' : ''}`}>
                                                {buttonsHover.myPayouts === true &&
                                                        <span className="text-[10px] bg-dark text-white -top-8 z-50 border rounded-md p-1 border-bordergray absolute text-center transition-all">My Payouts</span>
                                                }
                                                <FontAwesomeIcon icon={faMoneyBillTrendUp} className="text-green-500 text-[20px]"></FontAwesomeIcon>
                                        </div>

                                        <div
                                                onMouseEnter={() => setButtonsHover({ ...buttonsHoverRef.current, myLocks: true })}
                                                onMouseLeave={() => setButtonsHover({ ...buttonsHoverRef.current, myLocks: false })}
                                                onClick={() => setCurrentPage('MyLocks')}
                                                className={`flex relative hover:cursor-pointer hover:opacity-75 rounded-md transition-all items-center flex-col justify-center border border-bordergray ${currentPage === 'MyLocks' ? 'bg-primary text-dark' : ''}`}>
                                                {buttonsHover.myLocks === true &&
                                                        <span className="text-[10px] bg-dark text-white -top-8 border rounded-md p-1 border-bordergray absolute text-center transition-all">My Locks</span>
                                                }
                                                <FontAwesomeIcon icon={faLock} className=" text-[20px]"></FontAwesomeIcon>
                                        </div>
                                        {/* Disable contracts till they work */}
                                        <div
                                                onMouseEnter={() => setButtonsHover({ ...buttonsHoverRef.current, newLock: true })}
                                                onMouseLeave={() => setButtonsHover({ ...buttonsHoverRef.current, newLock: false })}
                                                onClick={() => setCurrentPage('NewLock')}
                                                className={`flex relative hover:cursor-pointer hover:opacity-75 rounded-md transition-all items-center flex-col justify-center border border-bordergray ${currentPage === 'NewLock' ? 'bg-primary text-dark' : ''}`}>
                                                {buttonsHover.newLock === true &&
                                                        <span className="text-[10px] bg-dark text-white -top-8 z-50 border rounded-md p-1 border-bordergray absolute text-center transition-all">New Lock</span>
                                                }
                                                <div className="flex items-center relative justify-center">
                                                        <FontAwesomeIcon icon={faLock} className=" text-[20px]"></FontAwesomeIcon>
                                                        <FontAwesomeIcon icon={faPlusCircle} className="text-green left-3 bg-white rounded-full absolute text-[15px]"></FontAwesomeIcon>
                                                </div>
                                        </div>


                                </div>
                                <div className="grid-rows-1 lg:grid-rows-2 flex-col w-full gap-2 grid-cols-3 lg:grid-cols-2 grid lg:px-2 h-auto lg:h-36 rounded-md">
                                        <div
                                                className="flex relative rounded-md transition-all items-center flex-col justify-center border border-bordergray">
                                                {/* {buttonsHover.upcomingpayouts === true && */}
                                                <span className="text-[10px] rounded-md p-1text-center transition-all">Total Lock</span>
                                                {/* } */}
                                                <div className="flex items-center gap-1 justify-center">
                                                        {Number(formatEther(staking.locks.locked)).toLocaleString(
                                                                undefined, // leave undefined to use the visitor's browser 
                                                                // locale or a string like 'en-US' to override it.
                                                                { minimumFractionDigits: 2 })}
                                                        <img src='/logo-letter.png' className='h-4' alt=""></img>
                                                </div>
                                        </div>
                                        <div
                                                className="flex relative rounded-md transition-all items-center flex-col justify-center border border-bordergray">
                                                {/* {buttonsHover.upcomingpayouts === true && */}
                                                <span className="text-[10px] rounded-md p-1text-center transition-all">My Lock</span>
                                                {/* } */}
                                                <div className="flex items-center gap-1 justify-center">
                                                        {Number(formatEther(staking.locks.share)).toLocaleString(
                                                                undefined, // leave undefined to use the visitor's browser 
                                                                // locale or a string like 'en-US' to override it.
                                                                { minimumFractionDigits: 2 })}
                                                        <img src='/logo-letter.png' className='h-4' alt=""></img>
                                                </div>
                                        </div>
                                        <div
                                                className="flex relative rounded-md transition-all lg:col-span-2 items-center flex-col justify-center border border-bordergray">
                                                {/* {buttonsHover.upcomingpayouts === true && */}
                                                <span className="text-[10px] rounded-md p-1text-center transition-all">Payouts</span>
                                                {/* } */}
                                                <div className="flex items-center">
                                                        ${Number(staking.payouts.usd_total).toLocaleString(
                                                                undefined, // leave undefined to use the visitor's browser 
                                                                // locale or a string like 'en-US' to override it.
                                                                { minimumFractionDigits: 2 })}+
                                                </div>
                                        </div>
                                </div>
                        </div>

                        <div className=" rounded-md border border-bordergray w-full lg:w-2/3 h-full">
                                {currentPage === 'MyPayouts' &&
                                        <MyPayouts payouts={payouts}></MyPayouts>
                                }
                                {currentPage === 'MyLocks' &&
                                        <MyLocks loading={locksLoading} token={lockContractToken} locks={locks} ></MyLocks>
                                }

                                {currentPage === 'NewLock' &&
                                        <CreateLock token={lockContractToken} balance={balance} />
                                }


                        </div>
                </div>);
}

export default Investments;