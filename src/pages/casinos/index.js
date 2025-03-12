import { useContext, useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { getLayout } from '@/components/CasinoLayout'
import { NetworkBox } from '@/components/common/NetworkBox'
import { BaseContext } from '@/context/BaseContext'
import Head from "next/head";
import dynamic from 'next/dynamic'

// Import SparklesCore with no SSR
const SparklesCore = dynamic(
  () => import('@/components/ui/sparkles').then((mod) => mod.SparklesCore),
  { ssr: false }
)

const Casino = () => {
  const { networks } = useContext(BaseContext)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className='h-full w-full'>
      <Head>
        <title>Supported Casino Networks - Gambly</title>
        <meta name="description" content="Supported Casino Networks" />
      </Head>

      <div className='h-[calc(100%-200px)] lg:h-[calc(100%)] absolute w-[100%] lg:w-[calc(100%-125px)]'>
        {isMounted && (
          <SparklesCore 
            particleColor={'#FFA843'} 
            particleDensity={10} 
            id={'casinoSparkles'} 
            className={'h-full w-full'} 
            background={'transparent'} 
          />
        )}
      </div>
      <div className="relative z-10 p-4 lg:p-6">

        <div className="mb-10">
          <h1 className="text-xl text-primary font-semibold">Supported Casino Networks</h1>
          <p className="text-dark-200 text-md mb-0">Select one of the networks to play...</p>
        </div>

        <div className="grid gap-10 grid-cols-3 lg:flex z-50">

          {networks.map((x, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.3 * (index),
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <NetworkBox network={x} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

Casino.getLayout = getLayout

export default Casino
