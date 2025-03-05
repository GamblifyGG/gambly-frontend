import { Money, Icon } from '@/components/common'
import { Button } from '@/components/form'
import Link from 'next/link'
import axios from "axios";
import io from 'socket.io-client'
import { CoinflipContext } from "@/context/CoinflipContext"
import { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import JoinGameModal from './JoinGameModal';
import { useRouter } from 'next/router';
import authTokens from "@/utils/authTokens"
import GameResult from "./GameResult"
import CoinHead from './CoinHead'
import { motion, useAnimate, useAnimation, useAnimationControls } from 'framer-motion';
import { convertNetworkID, convertNetworkNameToId } from "../../utils/convertNetworkID";

const CoinFlipRooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [socket, setSocket] = useState(null);
  // const [games, setGames] = useState([])
  const [game, setGame] = useState(null)
  const [doneGame, setDoneGame] = useState(null)

  const { games, fetchGames, removeGame, updateGame, addGame } = useContext(CoinflipContext)
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
  }, []);

  useEffect(() => {
    // make sure to fetch games with the token address and network
    console.log(router.query)
    fetchGames({ tokenAddress: router.query.token, network: convertNetworkNameToId(router.query.network), page: 1, limit: 10, type: "coinflip" })
  }, [])



  return (
    <>
      <div className="z-50 flex flex-grow flex-col h-full">
        <div className="border border-bordergray  rounded-xl bg-dark flex flex-grow">
          <table className=" flex w-full flex-col">
            <thead className='h-20 w-full items-center border-b border-bordergray grid grid-cols-6 lg:text-md text-sm'>
              {/* <tr className='flex w-full justify-between px-4'> */}
              <span className='flex items-center justify-center'>Game ID</span >
              <span className='flex items-center justify-center'>Stake</span >
              <span className='flex items-center justify-center'>Player One</span >
              <span className='flex items-center justify-center'>Status</span >
              <span className='flex items-center justify-center'>Player Two</span >
              {/* <span className='flex items-center justify-center'>Verify</span > */}
              <span className='flex items-center justify-center'>Privacy</span >
              {/* </tr> */}
            </thead>
            <tbody className='flex flex-col overflow-y-auto h-[calc(100vh-400px)]'>
              {
                games.map(x => (
                  <Link key={x.id} href={`/casinos/${convertNetworkID(userSettingsRef.current.casino.Network)}/${userSettingsRef.current.casino.TokenAddress}/coinflip/${x.id}`} className='h-auto w-full border-bordergray border-b'>
                    <div className="items-center grid grid-cols-6 h-20 w-full">
                      <td className='flex items-center justify-center'>
                        <div className="truncate max-w-[160px] px-2">
                          <span>{x.id}</span>
                        </div>
                      </td>
                      <td className='flex items-center justify-center'><Money value={x.amount} decimals={x.token.decimals} name="" /></td>
                      <td className='flex items-center justify-center'>
                        <div className="flex gap-2 items-center flex-col">
                          <img 
                            className={`rounded-full lg:w-10 lg:h-10 w-8 h-8 ${x.outcome === x.players[0].bet ? 'border-2 border-green ' : ''}`} 
                            src={`https://i.pravatar.cc/36?img=${x.players[0].user.id}`} 
                            alt="" 
                          />
                          {x.players[0].user.address == walletAddress && <span className="text-green text-[10px]">You</span>}
                          {x.players[0].user.address != walletAddress && <span className="text-[10px] truncate w-10 lg:w-20">{x.players[0].user.address}</span>}
                          {/* <span>player 1</span> */}
                        </div>

                      </td>
                      <td className='flex items-center justify-center'>
                        <div className="flex items-center gap-3">
                          {x.state == 'starting' && <Button variant="secondary" size="sm">Starting...</Button>}
                          {/* <CoinHead side={x.players[0].bet} title={x.players[0].bet} /> */}

                          {x.state == 'ended' && <Button className="w-20 lg:w-auto" variant="secondary" size="sm">Ended</Button>}
                          {x.state == 'waiting' && x.players[0].user.address != walletAddress && <Button size="sm" onClick={() => join(x)}>Join</Button>}
                          {x.state == 'waiting' && x.players[0].user.address == walletAddress && <Button size="sm" variant="dark">You Joined</Button>}
                          {x.state == 'ending' && <Button size="sm" variant="dark">Ending...</Button>}

                          {/* {x.players.length == 2 && <CoinHead side={x.players[1].bet} title={x.players[1].bet} />} */}
                        </div>

                      </td>
                      <td className='flex items-center justify-center'>
                        {
                          x.players.length == 2 &&
                          <div className="flex gap-2 items-center flex-col">
                            <img 
                              className={`rounded-full lg:w-10 lg:h-10 w-8 h-8 ${x.outcome === x.players[1].bet ? 'border-2 border-green ' : ''}`} 
                              src={`https://i.pravatar.cc/36?img=${x.players[1].user.id}`} 
                              alt="" 
                            />
                            {x.players[1].user.address == walletAddress && <span className="text-green text-[10px]">You</span>}
                            {x.players[1].user.address != walletAddress && <span className="text-[10px] truncate w-10 lg:w-20">{x.players[1].user.address}</span>}
                            {/* <span>player 2</span> */}
                          </div>
                        }
                        {
                          x.players.length == 1 && <span className="opacity-50">TBD</span>
                        }
                      </td>
                      <td className='flex items-center justify-center'>
                        <span>{x.privacy}</span>
                      </td>
                    </div>
                  </Link>
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-5">
          <Button variant="clear"><iconify-icon icon="bx:caret-left"></iconify-icon>previous</Button>
          <Button variant="clear" disabled>next<iconify-icon icon="bx:caret-right"></iconify-icon></Button>
        </div>
      </div>
      <JoinGameModal showModal={showModal} onJoin={join} setShowModal={setShowModal} game={game} />
      {/* <GameResult game={doneGame} showModal={showResultModal} setShowModal={setShowResultModal} /> */}
    </>
  )
}

export default CoinFlipRooms