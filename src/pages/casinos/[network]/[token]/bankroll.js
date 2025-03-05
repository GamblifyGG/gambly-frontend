import { useState } from 'react'
import { getLayout } from '@/components/CasinoLayout'
import { Button, Tbox } from '@/components/form'
import { CoinflipRooms } from '@/components/coinflip'
import { Modal, Icon, Circle } from '@/components/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBank, faFire } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { SparklesCore } from '@/components/ui/sparkles'

const Bankroll = () => {
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    return (
        <>
            <div className='items-center justify-center flex-grow w-full h-full relative'>
                <div className='items-center justify-center cont flex text-4xl gap-10 font-extrabold flex-col h-full '>
                    <div className='flex flex-col gap-10 z-50'>
                        <FontAwesomeIcon icon={faBank} className='text-primary text-9xl' />
                        <div className='items-center justify-center gap-2 flex h-full flex-col'>
                            <div className='flex gap-2'>The<span className="text-primary">Bankroll page</span></div>
                            <div className='flex gap-2'>is <span className="text-primary">Coming</span> Soon</div>
                        </div>
                        <div className='flex gap-2'>
                            <Button onClick={() => {
                                // push to the current tokens index page
                                router.push(`/casinos/${router.query.network}/${router.query.token}`)
                            }} classNames='bg-primary text-white'>Go Home</Button>
                        </div>
                    </div>
                </div>
                <div className='h-[calc(100%)] lg:h-[calc(100%)] top-0 lg:top-0 absolute w-[calc(100%)] z-1'>
                    <SparklesCore particleColor={['#FFA843']} particleDensity={10} id={'test'} className={'h-full w-full'} background={'red'} ></SparklesCore>
                </div>

            </div>
        </>
    )
}

Bankroll.getLayout = getLayout

export default Bankroll