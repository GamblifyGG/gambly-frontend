import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { getLayout } from '@/components/CasinoLayout'
import { Button, Select } from '@/components/form'
import { CreateGameModal } from '@/components/rps'
import { useRouter } from 'next/router'
import { SparklesCore } from '@/components/ui/sparkles'
import useStateRef from 'react-usestateref'
import LoadingSmall from '@/components/LoadingSmall'
import { convertNetworkNameToId } from '@/utils/convertNetworkID'
import RpsRooms2 from '@/components/rps/RpsRooms2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { BaseContext } from '@/context/BaseContext'
import { getRpsGames } from '@/api'
import RpsGame from '@/components/rps/RpsGame'
import { motion, AnimatePresence } from 'framer-motion'
import Head from "next/head";
import { Iconify } from "@/components/common"
import CasinoLoader from "@/components/CasinoLoader"

const CoinFlip = () => {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const eventSource = useRef(null)

  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [games, setGames, gamesRef] = useStateRef([])
  const [list, setList] = useState([])

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState('Games');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { token, user, signIn, casinoError, casinoLoading, setDepositToken, setShowDepositModal } = useContext(BaseContext)

  const [sortOrder, setSortOrder] = useState('desc');

  const pageOptions = [
    { id: 'Games', label: 'All Games' },
    { id: 'MyGames', label: 'My Games' },
    { id: 'EndedGames', label: 'Ended Games' },
    { id: 'MyEndedGames', label: 'My Ended Games' },
  ];

  const onNewGame = (game) => {
    setGames(prev => [...prev, game])
  }

  const fetchGames = async (chain_id, token_address) => {
    setLoading(true)
    const [er, data] = await getRpsGames({ 
      chain_id, 
      token_address,
      sort: 'created',
      order: sortOrder,
      ended: page === 'EndedGames' || page === 'MyEndedGames',
      mine: page === 'MyGames' || page === 'MyEndedGames',
      limit: 100
    })
    console.log('[RPS] fetchGames :', data.games)
    setLoading(false)

    if (data) {
      setGames(data?.games)
    }

    if (er) {
      setError(er?.error || er?.message || 'Error fetching games!')
    }
  }

  useEffect(() => {
    if (!router.isReady) return
    const networkId = convertNetworkNameToId(router.query.network)
    fetchGames(networkId, router.query.token)
  }, [router.isReady, router?.query, page, sortOrder])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const AnimatedComp = useCallback(({ children, id }) => {
    return (
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        // className='h-auto'
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }, []);

  if (casinoLoading || casinoError) {
    return <CasinoLoader casinoLoading={casinoLoading} casinoError={casinoError}/>
  }

  return (
    <div className="relative p-4">
      <Head>
        <title>Play Rock Paper Scissors {token ? `using ${token?.name}` : ''}- Gambly</title>
      </Head>

      <CreateGameModal
        showModal={showModal}
        setShowModal={setShowModal}
        token={token}
      />

      {/* Header */}
      <div className="lg:flex items-end gap-3 mb-4">
        <div className="mb-3 lg:mb-0">
          <div className="flex gap-2 items-center text-xl font-semibold">
            <img src={token?.logo} alt="" className="h-[20px] w-auto"/>
            <span className="text-primary">${token?.symbol}</span> Rock Paper Scissors Games
          </div>
          <p className="opacity-50 text-sm font-normal">Start playing using {token?.name} tokens.</p>
        </div>

        { user &&
        <div className="flex gap-3 lg:ml-auto">
          <Select
            value={page}
            onChange={(value) => setPage(value)}
            options={pageOptions.map(opt => ({
              value: opt.id,
              text: opt.label
            }))}
          />
          <Select
            value={sortOrder}
            onChange={(value) => setSortOrder(value)}
            options={[
              { value: 'desc', text: 'Newest First' },
              { value: 'asc', text: 'Oldest First' }
            ]}
          />

          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="primary-outline"
              className="lg:hidden"
              onClick={() => {
                setDepositToken(token)
                setShowDepositModal(true)
              }}
            >
              <Iconify icon="majesticons:data-plus" className="text-lg"/>
              Deposit {token?.symbol}
            </Button>

            <Button
              variant="secondary"
              className="text-dark"
              onClick={() => setShowModal(true)}>
              <Iconify icon="icon-park-solid:add-one" className="text-lg"/>
              Create
            </Button>
          </div>

        </div>
        }
      </div>
      {/* /Header */}

      { loading && <LoadingSmall className="h-[300px]" /> }

      { !loading && games.length === 0 && !user &&
        <div className="p-20 text-center">
          <div className="opacity-50 mb-4">Sign In To Create A Game</div>
          <Button variant="secondary-outline" onClick={signIn}>Connect Wallet</Button>
        </div>
      }

      { !loading && games.length === 0 && user &&
        <div className="p-20 text-center">
          <div className="opacity-50 mb-4">No games open at the moment.</div>
          <Button variant="secondary-outline" onClick={() => setShowModal(true)}>Create A Game</Button>
        </div>
      }

      { !loading && games.length > 0 &&
        <div className="z-40 flex flex-grow flex-col h-full">
        <div className="flex flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <AnimatePresence>
              {games.map(x => (
                <AnimatedComp key={x.id}>
                  <RpsGame x={x} user={user} />
                </AnimatedComp>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

CoinFlip.getLayout = getLayout

export default CoinFlip