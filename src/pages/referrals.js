import { getLayout } from '@/components/CasinoLayout'
import { GameBox, Icon } from '@/components/common'
import { GameBox2 } from '@/components/common/Gamebox2'
import { Button } from '@/components/form'
import ReferralListItem from '@/components/referrals/referralListItem'
import { SparklesCore } from '@/components/ui/sparkles'
import { BaseContext } from '@/context/BaseContext'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { getUserReferralStats, getUserReferralPayouts } from '@/api'
import Loading from '@/components/LoadingSmall'
import { toWebsiteUrl } from '@/utils/toWebsiteUrl'
import Head from "next/head";
import PleaseLogin from "@/components/PleaseLogin"
// import Hero from '@/components/casino/Hero'

// import RankTable from '@/components/casino/RankTable'
// import { Icon, GameBox } from '@/components/common'

// dynamically import the casino component
import dynamic from 'next/dynamic'
import { useContext, useEffect, useState } from 'react'
// hero
const Hero = dynamic(() => import('@/components/casino/Hero'))

const Referrals = () => {
    // const games = Array(6).fill(0).map((x, i) => i)
    const [casinos, setCasinos] = useState([])
    const { user, userAuth } = useContext(BaseContext);

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [referralBets, setReferralBets] = useState([])
    const [loading, setLoading] = useState(true)
    const [payouts, setPayouts] = useState([])
    const [stats, setStats] = useState({
        "users": 0,
        "payouts": {
          "total": 1,
          "usd_total": 1
        }
    })

    async function fetchReferals() {
        setLoading(true)
        const [er, data] = await getUserReferralStats()
        const [er2, data2] = await getUserReferralPayouts({})
        setLoading(false)

        if (data) {
            setStats(data)
        }

        if (data2) {
            setPayouts(data2?.payouts)
        }
    }

    useEffect(() => {
        if (!user) return
        fetchReferals()
    }, [user])

    const nextPage = () => {
        let token = localStorage.getItem('token')
        let refreshToken = localStorage.getItem('refreshToken')

        axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/referrals/getReferralBets/' + (currentPage + 1) + '/100?token=' + token + '&refreshToken=' + refreshToken).then((res) => {
            console.log("Referral bets", res.data)
            setReferralBets(res.data)
        }).catch((err) => {
            console.log("Error fetching casinos", err)
        })
        setCurrentPage(currentPage + 1)
    }

    const prevPage = () => {
        let token = localStorage.getItem('token')
        let refreshToken = localStorage.getItem('refreshToken')
        if (currentPage === 1) return;
        axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/referrals/getReferralBets/' + (currentPage - 1) + '/100?token=' + token + '&refreshToken=' + refreshToken).then((res) => {
            console.log("Referral bets", res.data)
            setReferralBets(res.data)
        }).catch((err) => {
            console.log("Error fetching casinos", err)
        })
        setCurrentPage(currentPage - 1)
    }

    // We need real data to tets pagination
    const getPaginationButton = (buttonType) => {
        if (buttonType === 'previous' && currentPage === 1) return <Button variant="clear" disabled><iconify-icon icon="bx:caret-left"></iconify-icon>previous</Button>
        if (buttonType === 'next' && currentPage === totalPages) return <Button variant="clear" disabled>next<iconify-icon icon="bx:caret-right"></iconify-icon></Button>
        if (buttonType === 'previous' && currentPage !== 1) return <Button onClick={() => {
            prevPage();
        }} variant="clear">previous</Button>
        if (buttonType === 'next' && currentPage !== totalPages) return <Button onClick={() => {
            nextPage();
        }} variant="clear">next</Button>
    }

    if (!userAuth) return <PleaseLogin />

    return (
        <div className="p-4 h-full w-full">
            <Head><title>Referrals - Gambly</title></Head>

            {/* <Hero /> */}
            <div className="flex z-50 lg:justify-between grid-cols-1 gap-2 flex-col w-full h-full ">
                {/* text */}
                <div className='h-[calc(100%-200px)] lg:h-[calc(100%-230px)] absolute w-full lg:w-[calc(100%-125px)]'>
                    <SparklesCore particleColor={'#FFA843'} particleDensity={10} id={'test'} className={'h-full w-full'} background={'red'} ></SparklesCore>
                </div>
                <div className='z-50 h-full'>
                    <div className='flex flex-col flex-grow h-full gap-1'>
                        <div className="flex flex-col px-10 pt-4">
                            <div className='flex justify-between'>
                                <h1 className="text-xl text-primary">Referrals</h1>
                                <div className='flex'>
                                    {/* view all */}
                                </div>
                            </div>
                            <p className="text-dark-200 text-xs">Earn tokens by referring friends to {process.env.NEXT_PUBLIC_WEBSITE_NAME}.</p>
                        </div>
                        { loading && <div className="flex justify-center items-center h-full"><Loading /></div> }
                        {/* games */}
                        { !loading &&
                        <div className='grid h-full gap-10 py-4 px-2 lg:px-10 justify-start grid-rows-[1fr_4fr] grid-cols-1 lg:grid-rows-1 lg:grid-cols-[2fr_3fr] w-full'>
                            {/* table */}
                            <div className='rounded h-full grid grid-rows-1 grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-4'>
                                <div className='h-full col-span-3 lg:col-span-1  bg-dark-700 border border-bordergray rounded-md p-2'>
                                    <span>Referral Link</span>
                                    <div className='flex items-center gap-2'>
                                        <input className='w-full bg-dark-700 border border-bordergray p-2' value={toWebsiteUrl(`?ref=${user?.referral_code || ''}`)} readOnly={true} />
                                        <button onClick={() => {
                                            navigator.clipboard.writeText(toWebsiteUrl(`?ref=${user?.referral_code || ''}`))
                                            alert(toWebsiteUrl(`?ref=${user?.referral_code || ''}`) + " is copied to clipboard")
                                        }} className='bg-primary text-white p-2 rounded-md'>Copy</button>
                                    </div>
                                </div>
                                <div className='h-full flex items-center justify-center flex-col border border-bordergray  bg-dark-700 rounded-md p-2'>
                                    <span>Users Referred</span>
                                    <span className='text-xs text-gray lg:flex hidden'>The amount of people that have signed up using your code.</span>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-secondary'>{stats?.users}</span>
                                    </div>
                                </div>
                                <div className='h-full flex items-center justify-center flex-col border border-bordergray  bg-dark-700 rounded-md p-2'>
                                    <span>Total $ Earned</span>
                                    <span className='text-xs lg:flex hidden text-gray'>The total amount of money you have earned from referrals.</span>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-secondary'>${stats?.payouts?.usd_total}</span>
                                    </div>
                                </div>

                            </div>
                            <div className='border h-[calc(100%-100px)] lg:h-auto border-bordergray w-full relative bg-dark-700 rounded-md'>
                                <div className='h-[calc(100%-100px)] lg:h-[calc(100%-50px)] w-full overflow-y-auto flex-col absolute'>
                                    <div className='grid grid-cols-4 p-2 border-b border-bordergray'>
                                        {/* <span>Address</span> */}
                                        <span>Amount</span>
                                        <span>Token</span>
                                        <span >Value</span>
                                        <span className='justify-self-end'>Time</span>
                                    </div>
                                    <div className=''>
                                        {payouts?.map((item, index) => {
                                            return <ReferralListItem key={index} item={item} />
                                        })}

                                        {referralBets?.length === 0 &&
                                            <div className='p-2 text-xs grid-cols-5 h-full grid justify-between border-b border-bordergray'>
                                                <div className='col-span-5 text-center'>No Referral Payouts Yet</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='bottom-0 h-[50px] flex gap-2 items-center justify-center  w-full absolute'>
                                    {getPaginationButton('previous')}
                                    {currentPage} / {totalPages}
                                    {getPaginationButton('next')}
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

Referrals.getLayout = getLayout

export default Referrals
