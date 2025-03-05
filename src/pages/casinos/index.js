import { useContext } from 'react'
import { motion } from 'framer-motion';
import { getLayout } from '@/components/CasinoLayout'
import { NetworkBox } from '@/components/common/NetworkBox'
import { BaseContext } from '@/context/BaseContext'
import Head from "next/head";

const Casino = () => {
  const { networks } = useContext(BaseContext)

  return (
    <div className="relative z-10 p-4 lg:p-6">
      <Head>
        <title>Supported Casino Networks - Gambly</title>
        <meta name="description" content="Supported Casino Networks" />
      </Head>
      <div className="mb-10">
        <h1 className="text-xl text-primary font-semibold">Supported Casino Networks</h1>
        <p className="text-dark-200 text-md mb-0">Select one of the networks to play...</p>
      </div>

      <div className="grid gap-10 grid-cols-3 lg:flex">
        { networks.map((x, index) =>
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
  )
}

Casino.getLayout = getLayout

export default Casino
