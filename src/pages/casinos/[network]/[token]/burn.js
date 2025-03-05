import { useContext, useEffect, useState } from 'react'
import { getLayout } from '@/components/CasinoLayout'
import { Button, Tbox } from '@/components/form'
import { CoinflipRooms } from '@/components/coinflip'
import { Modal, Icon, Circle } from '@/components/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBank, faClock, faFire, faWarning } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { SparklesCore } from '@/components/ui/sparkles'
import { convertNetworkNameToId } from '@/utils/convertNetworkID'
import { BaseContext } from '@/context/BaseContext'
import { formatUnits } from 'viem'
import axios from 'axios'
import CompleteBurnButton from '@/components/bank/CompleteBurnButton'
import { getCasinoBurns, burnCasinoBalance } from '@/api/casino'
import Notification from '@/components/poker/Notification'
import Loading from "@/components/LoadingSmall"
import BurnChart from "@/components/BurnChart2";
import Head from "next/head";
import { toast } from "react-toastify";
import { getApiError } from "@/utils/api"

const BurnPage = () => {
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()
    const { token, network, casino, user } = useContext(BaseContext);

    const [casinoError, setCasinoError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null)
    const [notificationVariant, setNotificationVariant] = useState('info')


    const [burnLoading, setBurnLoading] = useState(false)
    const [burns, setBurns] = useState([])

    function showNotification(msg, variant = 'info') {
        setNotification(msg)
        setNotificationVariant(variant)
    }

    async function fetchBurns(chain_id, token_address, show_loading = true) {
        if (show_loading) {
            setLoading(true)
            setCasinoError(null)
        }

        const [er, data] = await getCasinoBurns({ chain_id, token_address })
        setLoading(false)

        if (er) {
            console.error(er)
            const m = er?.error || er?.details || er?.message
            console.log('[BURNS:ERR]', m)
            return
        }

        if (data) {
            const b = data.burns.map(x => {
                return {
                    ...x,
                    casino: data.casinos.find(c => c.id === x.casino.id)
                }
            })
            console.log('[BURNS]', b)
            console.log(casino)
            setBurns(b)
        }
    }

    useEffect(() => {
        if (!router.isReady || !network || !token) return;
        fetchBurns(network?.id, token?.address)
    }, [token, network, router.isReady]);


    const requestBurn = async () => {
        setBurnLoading(true)
        const [er, data] = await burnCasinoBalance(token?.network?.id, token?.address)
        setBurnLoading(false)

        if (er) {
            console.log('[BURN:ERR]', er)
            const msg = getApiError(er)
            toast.error(msg, { theme: 'colored', closeButton: false, position: 'bottom-right' })
        }

        if (data) {
            console.log('[BURN]', data)
            toast.success("Burn request accepted.", { theme: 'colored', closeButton: false, position: 'bottom-right' })
            fetchBurns(token?.network?.id, token?.address, false)
        }
    }

    return (
        <>
    <Head>
        <title>Burn { token ? `${token?.name} Tokens` : 'Tokens'} - Gambly</title>
      </Head>
            {notification && (
                    <Notification
                        message={notification}
                        variant={notificationVariant}
                        duration={3000}
                        onClose={() => setNotification('')}
                    />
                )}
            <div className="p-4 relative flex flex-col lg:flex-row gap-4 lg:gap-7">
                <div class="lg:w-2/5 order-2 lg:order-1">
                
                    <BurnChart token={token} className="mb-4" />

                    <div className='text-xs font-normal p-4 border border-gray rounded-md mb-4'>{process.env.NEXT_PUBLIC_WEBSITE_NAME} burns  a portion of the tokens collected from the casinos.
                        <br></br>
                        <br></br>The amount of tokens burned is calculated based on total wagers of the casinos.
                        <div className='text-primary flex gap-1 items-center mt-2'> <FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>This feature is not available for all tokens.</div>
                    </div>

                </div>

                <div class="lg:w-3/5 order-1 lg:0rder-2">

                <div className=''>
                                    <div className="font-semibold text-lg flex mb-[20px]">
                                        <div>
                                        <FontAwesomeIcon icon={faFire} className='text-red mr-2' /> Past ${token?.symbol} Burns
                                        <p className='text-sm text-lightgray font-normal'>
          Token Burn history
        </p>
                                        </div>
                                        <div className="ml-auto">
                            { user &&                
                    <button
                        onClick={() => {
                        if (burnLoading) return;
                        requestBurn()
                    }} className='flex gap-2 justify-center items-center py-2 px-5  hover:opacity-80 cursor-pointer border border-primary bg-primary/5 rounded-xl'>
                        <span className='text-lg'>{burnLoading ? 'Burning...' : 'Burn Tokens'}</span>
                        {burnLoading ? <div className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary'></div> : <FontAwesomeIcon icon={faFire} className='text-red text-lg' />}
                    </button> }
                                        </div>
                                    </div>

                                    <div className='relative h-full border border-bordergray rounded-md'>
                                        <div className='grid grid-cols-[3fr_1fr_1fr] gap-2 justify-between p-4 font-semibold'>
                                            <span className='text-xs'>Amount</span>
                                            <span className='text-xs place-self-end'>Time</span>
                                            <span className='text-xs place-self-end'>Actions</span>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            { loading && 
                                            <div className="border border-t border-gray text-center p-8">
                                                <Loading />
                                            </div>
                                            }
                                            { !loading && burns.length == 0 &&
                                            <div className="text-lightgray border-t border-gray text-center p-8">No burns so far!</div>
                                            }
                                            { !loading && burns.map((x, index) => {
                                                return (
                                                    <div key={index} className='grid grid-cols-[3fr_1fr_1fr] justify-between p-4 border-t border-bordergray'>
                                                        <span className='text-[10px]'>{formatUnits(x.amount, x.casino?.token.decimals) + " " + x.casino?.token.symbol}</span>
                                                        <span className='text-[10px]  place-self-end'>{new Date(x.created).toLocaleString()}</span>
                                                        <div className='text-[10px]  place-self-end'>
                                                            {
                                                                x.completed ?
                                                                <span className=' p-1 rounded-md shadow-md text-dark bg-secondary'>✅ Completed</span>
                                                                : user &&
                                                                <CompleteBurnButton
                                                                    token={x.casino.token}
                                                                    message={x.message}
                                                                    signature={x.signature}
                                                                    amount={x.amount}
                                                                    transactionId={x.id}
                                                                />
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                </div>
            </div>
        </>
    )
}

BurnPage.getLayout = getLayout

export default BurnPage