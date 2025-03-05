import { AnimatePresence } from 'framer-motion'
import { useEffect, useState, useContext, useCallback } from "react"
import { useRouter } from 'next/router'
import io from 'socket.io-client'

import { Button } from '@/components/form'
import { CoinflipContext } from "@/context/CoinflipContext"
import { convertNetworkID, convertNetworkNameToId } from "../../utils/convertNetworkID"
import { motion, useAnimate, useAnimation, useAnimationControls } from 'framer-motion'
import authTokens from "@/utils/authTokens"
import CoinflipGame from './CoinflipGame'
import CoinHead from './CoinHead'
import FlippingCoin from './FlippingCoin'
import GameResult from "./GameResult"
import JoinGameModal from './JoinGameModal'
import { BaseContext } from '@/context/BaseContext'

const CoinFlipRooms2 = ({ page, casino }) => {
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [socket, setSocket] = useState(null);
  // const [games, setGames] = useState([])
  const [game, setGame] = useState(null)
  const [doneGame, setDoneGame] = useState(null)

  const { games, fetchGames, removeGame, updateGame, addGame } = useContext(CoinflipContext)
  const router = useRouter();
  const [localGames, setLocalGames] = useState([])
  const { user, userAuth } = useContext(BaseContext)

  const controls = useAnimation()

  const join = (v) => {
    setGame(v)
    setShowModal(true)
  }

  const gameResult = (v) => {
    setDoneGame(v)
    setShowResultModal(true)
  }

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/pvp/coinflip`

    const newSocket = io(url, {
      query: authTokens()
    });

    newSocket.on('game_update', (data) => {
      console.log("Game Update", data)
      if (data.type !== "coinflip") return

      console.log("[COINFLIP UPDT]", data.state, data)

      if (data.state == "ended") {
        gameResult(data)
        removeGame(data.id)
      } else if (["starting", "waiting"].includes(data.state)) {
        addGame(data)
      } else {
        updateGame(data)
      }
    })

    setSocket(newSocket);

    return () => {
      newSocket.close();
      newSocket.disconnect();
    }
  }, [addGame, removeGame, updateGame]);

  useEffect(() => {
    let state = "waiting";
    if (page === "LiveRooms") {
      state = "waiting";
    } else if (page === "MyRooms") {
      state = "waiting";
    } else if (page === "PreviousGames") {
      state = "ended";
    }
    console.log("Fetching games with state:", state)
    // make sure to fetch games with the token address and network
    fetchGames({ tokenAddress: router.query.token, network: convertNetworkNameToId(router.query.network), page: 1, limit: 10, type: "coinflip", state: state })
  }, [page])


  useEffect(() => {
    setLocalGames(games)
  }, [games])

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
  
  return (
    <>
      <div className="z-40 flex flex-grow flex-col h-full">
        <div className="rounded-xl border border-bordergray bg-dark p-2 flex flex-grow">
          <div className="grid grid-cols-1 h-[calc(100vh-16rem)] overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <AnimatePresence>
              {localGames.map(x => (
                <AnimatedComp key={x.id}>
                  <CoinflipGame x={x} />
                </AnimatedComp>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-5 mt-4">
          <Button variant="clear"><iconify-icon icon="bx:caret-left"></iconify-icon>previous</Button>
          <Button variant="clear" disabled>next<iconify-icon icon="bx:caret-right"></iconify-icon></Button>
        </div>
      </div >
      <JoinGameModal showModal={showModal} onJoin={join} setShowModal={setShowModal} game={game} />
    </>
  )
}

export default CoinFlipRooms2
