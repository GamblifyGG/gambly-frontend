import { Money, Icon } from '@/components/common'
import { Button } from '@/components/form'
import Link from 'next/link'
import axios from "axios";
import io from 'socket.io-client'
import { RockPaperScissorsContext } from "@/context/RockPaperScissorsContext"
import { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import JoinGameModal from './JoinGameModal';
import { useRouter } from 'next/router';
import authTokens from "@/utils/authTokens"
import GameResult from "./GameResult"
import CoinHead from './CoinHead'
import { motion, useAnimate, useAnimation, useAnimationControls } from 'framer-motion';
import { convertNetworkID, convertNetworkNameToId } from "../../utils/convertNetworkID";
import FlippingCoin from './FlippingCoin';
import RpsGame from './RpsGame';
import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

const RpsRooms2 = ({ page }) => {
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [socket, setSocket] = useState(null);
  // const [games, setGames] = useState([])
  const [game, setGame] = useState(null)
  const [doneGame, setDoneGame] = useState(null)
  const { games, fetchGames, removeGame, updateGame, addGame } = useContext(RockPaperScissorsContext)


  const [localGames, setLocalGames] = useState([])
  const router = useRouter();


  const walletAddress = null


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
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/pvp/rock-paper-scissors`

    const newSocket = io(url, {
      query: authTokens()
    });

    newSocket.on('connect', () => {
      console.log("[RPS IO]", "connected")
    })

    newSocket.on('game_update', (data) => {
      console.log("Game Update", data)
      if (data.type !== "rock-paper-scissors") return

      console.log("RPS UPDT]", data.state, data)

      if (data.state == "ended") {
        updateGame(data)
        gameResult(data)
        // remove after 5 seconds
        setTimeout(() => {
          removeGame(data.id)
        }, 10000)
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
  }, [page, router.query.network, router.query.token, fetchGames])

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
          {localGames.length === 0 && <div className="text-center text-dark-200 h-full w-full flex items-center justify-center">No games found</div>}
          {localGames.length > 0 &&
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full overflow-y-auto h-[calc(100vh-16rem)] content-start">
              <AnimatePresence>

                {localGames.map(x => (
                  <AnimatedComp key={x.id} id={x.id}>
                    <RpsGame x={x} />
                  </AnimatedComp>
                ))}

              </AnimatePresence>
            </div>
          }
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-5">
          <Button variant="clear"><iconify-icon icon="bx:caret-left"></iconify-icon>previous</Button>
          <Button variant="clear" disabled>next<iconify-icon icon="bx:caret-right"></iconify-icon></Button>
        </div>
      </div >
      <JoinGameModal showModal={showModal} onJoin={join} setShowModal={setShowModal} game={game} />
    </>
  )
}

export default React.memo(RpsRooms2)