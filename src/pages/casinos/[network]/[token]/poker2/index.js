import { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import useStateRef from 'react-usestateref'
import Head from "next/head";

import LoadingSmall from '@/components/LoadingSmall'
import CreateTableModal from '@/components/poker/CreateTableModal'
import PokerRooms from '@/components/poker/PokerRooms2'
import { SparklesCore } from '@/components/ui/sparkles'
import { getPokerTables } from '@/api'
import { getLayout } from '@/components/CasinoLayout'
import { BaseContext } from '@/context/BaseContext'
import { convertNetworkNameToId } from '@/utils/convertNetworkID'
import { Button, Select } from "@/components/form"
import { Iconify } from "@/components/common"

const Poker = () => {
  const [casino, setCasino] = useState(null)
  const [casinoError, setCasinoError] = useState(null)
  const [games, setGames, gamesRef] = useStateRef([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('AllRooms')
  const [rooms, setRooms] = useStateRef([])
  const [showModal, setShowModal] = useState(false)
  const { user, token, setShowDepositModal } = useContext(BaseContext)
  const router = useRouter()
  const eventSource = useRef(null)

  const toPokerData = (data) => {
    const { casinos, tables } = data

    function getCasino(id) {
      return casinos.find(x => x.id === id)
    }

    return tables.map(x => {
      const { token } = getCasino(x.casino.id)
      
      return {
        token,
        ...x
      }
    })
  }

  const getRooms = async (chain_id, token_address) => {
    setLoading(true)
    const [er, data] = await getPokerTables({ chain_id, token_address })
    setLoading(false)

    if (er) {
      console.log(er)
      setCasinoError(er?.details || er?.error || er?.message)

      return
    }

    setGames(toPokerData(data))
    setRooms(toPokerData(data))
    setCasino(data?.casinos[0])
    setLoading(false)
  }

  useEffect(() => {
    setGames(page == 'AllRooms' || !user ? rooms : rooms.filter(x => x.creator.wallet_address == user.wallet_address))
  }, [page, user, rooms])

  useEffect(() => {
    if (!router.isReady) return

    const networkId = convertNetworkNameToId(router.query.network)

    getRooms(networkId, router.query.token)

    const url =`${process.env.NEXT_PUBLIC_API_URL}casinos/${networkId}/${router.query.token}/poker/live`
    console.log('[SSE]', url);

    if (eventSource.current) eventSource.current.close()
    eventSource.current = new EventSource(url)

    eventSource.current.onopen = () => {
      console.log('[SSE] Connection established :', url, token)
    }

    eventSource.current.addEventListener('tableCreated', (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('[SSE] tableCreated :', data?.table)
        const exists = gamesRef.current.find(x => x.id === data?.table?.id)
        const tbl = {...data?.table, token }
        if (!exists) setGames(prev => [...prev, tbl])
      } catch (e) {
        console.error(e)
      }
    })

    eventSource.current.onerror = (error) => {
      console.error('[SSE] Error :', error)
    };

    return () => {
      eventSource.current.close()
    }
  }, [router.isReady, router?.query])

  return (
    <div className="relative p-4">
      <Head>
        <title>Play Poker {token ? `using ${token?.name}` : ''}- Gambly</title>
      </Head>

      <CreateTableModal token={token} showModal={showModal} setShowModal={setShowModal} />

      {/* Header */}
      <div className="lg:flex items-end gap-3 mb-4">
        <div className="mb-3 lg:mb-0">
          <div className="flex gap-2 items-center text-xl font-semibold">
            <img src={token?.logo} alt="" className="h-[20px] w-auto"/>
            <span className="text-primary">${token?.symbol}</span> Poker Rooms
          </div>
          <p className="opacity-50 text-sm font-normal">Start playing using {token?.name} tokens.</p>
        </div>

        <div className="flex gap-3 lg:ml-auto">
          <Select
            value={page}
            onChange={(value)=> setPage(value)}
            options={[
              { value: 'AllRooms', text: 'All Rooms'},
              { value: 'MyRooms', text: 'My Rooms'}
            ]}
          />

          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="primary-outline"
              className="lg:hidden"
              onClick={() => setShowDepositModal(true)}
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
      </div>
      {/* /Header */}

      <div>
        { loading && <LoadingSmall className="h-[300px]"/>}
        { !loading && <PokerRooms showModal={showModal} setShowModal={setShowModal} rooms={games} /> }
      </div>
    </div>
  )
}

Poker.getLayout = getLayout

export default Poker
