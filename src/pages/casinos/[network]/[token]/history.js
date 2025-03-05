import { useContext, useEffect, useState } from 'react'
import { getLayout } from '@/components/CasinoLayout'
import { BaseContext } from '@/context/BaseContext'
import LoadingSmall from '@/components/LoadingSmall'
import { formatUnits } from 'viem'
import { Iconify } from '@/components/common'
import Head from 'next/head'
import { Button } from '@/components/form'
import { useRouter } from 'next/router'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@/components/common'
import { getUserBets } from '@/api/user'
import { convertNetworkNameToId } from '@/utils/convertNetworkID'

const BetsHistory = () => {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useContext(BaseContext)
  const router = useRouter()

  const fetchBets = async (chainId, tokenAddress, page = 1) => {
    setLoading(true)
    try {
      if (isNaN(chainId)) {
        console.error('Invalid chain ID:', chainId)
        return
      }

      const offset = (page - 1) * 10

      const [error, response] = await getUserBets(chainId, tokenAddress, {
        sort: 'created',
        order: 'desc',
        limit: 10,
        offset
      })
      
      console.log('API Response:', response)
      
      if (error) {
        console.error('Error fetching bets:', error)
        return
      }

      setBets(response?.bets || [])
      setTotalPages(Math.ceil((response?.meta?.total || 0) / 10))
    } catch (error) {
      console.error('Error fetching bets:', error)
      setBets([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (router.isReady && user && router.query.network && router.query.token) {
      const chainId = convertNetworkNameToId(router.query.network)
      fetchBets(chainId, router.query.token, currentPage)
    }
  }, [router.isReady, user, router.query.network, router.query.token, currentPage])

  console.log('Current bets state:', bets) // Debug log
  console.log('Loading state:', loading) // Debug log

  if (!router.isReady) {
    return <LoadingSmall />
  }

  const { network, token } = router.query

  const GameIcon = ({ gameType }) => {
    switch (gameType?.toLowerCase()) {
      case 'poker':
        return <Icon name="poker" size="24px" />
      case 'coinflip':
        return <Icon name="coin" size="24px" />
      case 'rps':
        return <Icon name="rps" size="24px" />
      default:
        return <Iconify icon="mdi:gamepad" className="text-xl text-primary" />
    }
  }

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  }

  const LoadingAnimation = () => (
    <tr>
      <td colSpan="6">
        <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-full h-full border-4 border-primary/20 rounded-full"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full animate-spin">
              <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          </div>
          <p className="text-dark-200 animate-pulse">Loading your betting history...</p>
        </div>
      </td>
    </tr>
  )

  const formatAmount = (amount) => {
    if (!amount) return '0'
    // Remove the negative sign for display, we'll show it differently
    const absoluteAmount = amount.startsWith('-') ? amount.substring(1) : amount
    return formatUnits(absoluteAmount, 18) // Assuming 18 decimals for all tokens
  }

  const getGameResult = (bet) => {
    switch (bet.type) {
      case 'win':
        return { won: true, amount: bet.amount }
      case 'enter':
      case 'create':
        return { won: false, amount: bet.amount }
      default:
        return { won: null, amount: bet.amount }
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Head>
        <title>Betting History - Gambly</title>
      </Head>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-primary bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Betting History
        </h1>
        <p className="text-dark-200 mt-2">View your betting history for this token</p>
      </motion.div>

      {!user ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-dark-700/50 backdrop-blur-sm rounded-xl border border-bordergray/50"
        >
          <Iconify icon="mdi:wallet-outline" className="text-6xl text-primary mb-4" />
          <p className="text-lg">Please connect your wallet to view betting history</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-700/90 backdrop-blur-sm rounded-xl border border-bordergray/50 shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-bordergray/50">
                  <th className="p-4 text-dark-200">Game</th>
                  <th className="p-4 text-dark-200">Type</th>
                  <th className="p-4 text-dark-200">Amount</th>
                  <th className="p-4 text-dark-200">Result</th>
                  <th className="p-4 text-dark-200">Date</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <LoadingAnimation key="loading" />
                  ) : bets.length === 0 ? (
                    <tr key="empty">
                      <td colSpan="5">
                        <motion.div className="text-center py-16">
                          <Iconify icon="mdi:history" className="text-6xl text-dark-200 mb-4" />
                          <p className="text-lg">No betting history found</p>
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    bets.map((bet, index) => {
                      const result = getGameResult(bet)
                      return (
                        <motion.tr 
                          key={`${bet.game_id}-${bet.type}`}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: 20 }}
                          className={`border-b border-bordergray/50 hover:bg-dark-600/50 transition-colors ${
                            index % 2 === 0 ? 'bg-dark-800/50' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center">
                                <GameIcon gameType={bet.game_type} />
                              </div>
                              <span className="capitalize font-medium">{bet.game_type}</span>
                            </div>
                          </td>
                          <td className="p-4 capitalize">
                            {bet.type.replace('_', ' ')}
                          </td>
                          <td className="p-4 font-mono">
                            {formatAmount(bet.amount)}
                          </td>
                          <td className="p-4">
                            {result.won !== null && (
                              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                result.won 
                                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
                              }`}>
                                {result.won ? 'Won' : 'Bet'}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {new Date(bet.created).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </motion.tr>
                      )
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-3 p-4 border-t border-bordergray/50"
            >
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="hover:bg-dark-600/50"
              >
                <Iconify icon="bx:caret-left" className="mr-1" /> Previous
              </Button>
              <div className="flex items-center gap-2 px-4">
                <span className="text-primary font-medium">{currentPage}</span>
                <span className="text-dark-200">/</span>
                <span className="text-dark-200">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="hover:bg-dark-600/50"
              >
                Next <Iconify icon="bx:caret-right" className="ml-1" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}

BetsHistory.getLayout = getLayout

export default BetsHistory
