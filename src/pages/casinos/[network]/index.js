import { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion';
import { getLayout } from '@/components/CasinoLayout'
import { GameBox2 } from '@/components/common/Gamebox2'
import { BaseContext } from '@/context/BaseContext'
import LoadingSmall from '@/components/LoadingSmall'
import useStateRef from "react-usestateref";
import Button from '@/components/form/Button'
import { getCasinos } from '@/api'
import { useRouter } from 'next/router'
import Head from "next/head";

const Casino = () => {
  const { getNetworkFromName, setNetworkTokens, networkError } = useContext(BaseContext)
  const [network, setNetwork] = useState(null)
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage, currentPageRef] = useStateRef(1);
  const [casinos, setCasinos] = useState([])
  const [casinosLoading, setCasinosLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(0);
  const afterIdRef = useRef(null)
  const idsRef = useRef({})
  const router = useRouter()

  const nextPage = () => {
      if (currentPageRef.current === totalPages) return;
      afterIdRef.current = idsRef.current[currentPageRef.current]
      setCurrentPage(currentPageRef.current + 1);
      fetchCasinos()
  }

  const prevPage = () => {
      if (currentPageRef.current === 1) return;
      afterIdRef.current = currentPageRef.current == 2 ? null : idsRef.current[currentPageRef.current - 2]
      setCurrentPage(currentPageRef.current - 1);
      fetchCasinos()
  }

  const fetchCasinos = async () => {
    setError(null)
    setCasinosLoading(true)
    setNetworkTokens({ tokens: [], total: 0 })
    console.log('[Fetch Casinos]', network?.id, '...')

    const [err, data] = await getCasinos({
      limit,
      order: 'asc',
      after: afterIdRef.current,
      chain_id: network?.id,
    })

    setCasinosLoading(false)

    if (err) {
      console.error(err)
      setError(err?.message || 'Could not fetch casinos!')
    }

    if (data) {
      setTotalPages(Math.ceil(data.meta.total / limit))
      setCasinos(data.casinos)
      if(currentPageRef.current === 1) {
        setNetworkTokens({ 
          tokens: data.casinos.map(x => x.token),
          total: data.meta.total
        })
      }
      if (data.casinos.length) idsRef.current[currentPageRef.current] = data.casinos.at(-1)?.id
    }
  }

  useEffect(() => {
    if (!network) return
    fetchCasinos()
  }, [network])

  useEffect(() => {
    if (!router.isReady || !router.query?.network) return
    setNetwork(getNetworkFromName(router.query?.network))
  }, [router.isReady, router.query?.network, router.pathname])

  return (
    <div className="relative z-10 p-4 lg:p-6 mx-auto max-w-[1400px]">
      <Head>
        <title>{ network ? `Popular ${network?.name?.toUpperCase()} Casinos - Gambly` : "" }</title>
      </Head>

      <div className="mb-10">
        <h1 className="text-xl text-primary font-semibold capitalize">Popular {network?.name} Casinos</h1>
        <p className="text-dark-200 text-md mb-10">Most popular casinos on {process.env.NEXT_PUBLIC_WEBSITE_NAME} by volume.</p>
      </div>

      { networkError &&
        <div className="cont flex flex-col items-center justify-center">
          <img src="/logo-letter.png" className="h-32 animate-pulse" />
          <div className="text-xl font-extrabold mb-4 text-red">Casino Network Not Found!</div>
          <div className="mb-4">
            { networkError }
          </div>
          <Link href='/casinos' className="text-primary underline">View all available casino networks</Link>
        </div>
      }

      { error &&
        <div className="cont flex flex-col items-center justify-center">
          <img src="/logo-letter.png" className="h-32 animate-pulse" />
          <div className="text-xl font-extrabold mb-4 text-red">Something Went Wrong!</div>
          <div className="mb-4">
            { error }
          </div>
        </div>
      }

      { !networkError && !casinosLoading && !casinos?.length && <div className="p-10 opacity-50"><span className="capitalize">{network?.name}</span> casinos coming soon...</div>}

      { casinosLoading &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 xl:gap-12 justify-start grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      >
        {
          [0,1,2,3,4].map(x => 
            <div key={x} className="bg-gray rounded-3xl h-[160px] w-full animate-pulse mx-auto">

            </div>
          )
        }
      </motion.div>
      }

      <div className='grid gap-6 xl:gap-12 justify-start grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'>
        { !casinosLoading && casinos && casinos.length &&
          casinos.map((casino, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.1 * (index),
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <GameBox2 className="mx-auto" token={casino.token} tokenAddress={casino.token.address} network={casino.token.network.name.toLowerCase()} logo={casino.token.logo !== null ? casino.token.logo : '/placeholder.png'} tokenSymbol={casino.token.symbol}/>
            </motion.div>
          )
        }
      </div>

      { !networkError && !casinosLoading && totalPages > 1 &&
        <div className="flex items-center gap-5 py-4">
          <Button
              variant="outline"
              disabled={currentPage == 1}
              onClick={prevPage}
          ><iconify-icon icon="bx:caret-left"></iconify-icon>Previous</Button>
          {currentPage} / {totalPages}
          <Button
              variant="outline"
              disabled={currentPage == totalPages}
              onClick={nextPage}
          >Next<iconify-icon icon="bx:caret-right"></iconify-icon></Button>
      </div>
      }
    </div>
  )
}

Casino.getLayout = getLayout

export default Casino
