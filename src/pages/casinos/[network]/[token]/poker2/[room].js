import { useState, useRef, useContext, useEffect, createRef } from "react"
import { useRouter } from "next/router"
import useStateRef from "react-usestateref"
import { toast } from "react-toastify";
import { formatUnits } from "viem"
import io from "socket.io-client"
import Head from "next/head";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { motion, AnimatePresence } from "framer-motion"

import { BaseContext } from "@/context/BaseContext"
import { convertNetworkNameToId } from "@/utils/convertNetworkID"
import { devLog, sleep } from "@/utils/common"
import { getPokerTable } from "@/api"
import LoadingSmall from "@/components/LoadingSmall"
import Seat from "@/components/poker2/Seat";
import CommunityCards from "@/components/poker2/CommunityCards"
import RoundMessage from "@/components/poker2/RoundMessage"
import { Button } from "@/components/form"
import { Iconify } from "@/components/common"

const Poker = () => {
  const [loading, setLoading] = useState(true)
  const [communityCards, setCommunityCards, communityCardsRef] = useStateRef([])
  const [pot, setPot, potRef] = useStateRef(null)
  const [round, setRound, roundRef] = useStateRef(null)
  const [seats, setSeats, seatsRef] = useStateRef([])
  const [players, setPlayers, playersRef] = useStateRef([])
  const [seatToJoin, setSeatToJoin] = useState(-1)
  const [winners, setWinners, winnersRef] = useStateRef(null)
  const [table, setTable, tableRef] = useStateRef(null)
  const [connected, setConnected] = useState(false)
  const [roundTimer, setRoundTimer] = useState(0)
  const [joinMessage, setJoinMessage] = useState(null)
  const [roundMessage, setRoundMessage] = useState(null)
  const [isDealing, setIsDealing, isDealingRef] = useStateRef(false)
  const [isDealt, setIsDealt, isDealtRef] = useStateRef(false)
  const [showDeck, setshowDeck] = useState(false)
  const [ended, setEnded, endedRef ] = useStateRef(false)
  const sock = useRef(null)
  const router = useRouter()
  const cardDealRefs = useRef([...Array(20)].map(() => createRef(null)));
  const seatRefs = useRef([...Array(10)].map(() => createRef(null)));
  const { userAuth, user, balancesLoading, tokenBalance, token, setShowDepositModal } = useContext(BaseContext)

  const moveToTarget = (inputTarget, refTarget) => {
    console.log('[MOVE]', inputTarget, refTarget)
    return new Promise((resolve, reject) => {

        const targetRect = inputTarget.current?.getBoundingClientRect();
        const movingRect = refTarget.current?.getBoundingClientRect();



        if (!targetRect || !movingRect) {
            resolve()
            return
        }

        // console.log('Target Rect:', targetRect);
        // console.log('Moving Rect:', movingRect);

        // console.log('Target Rect:', targetRect);
        // console.log('Moving Rect:', movingRect);
        let initialPosition = {
            x: refTarget.left,
            y: refTarget.top
        };

        let deltaX = targetRect.left - movingRect.left;
        let deltaY = targetRect.top - movingRect.top;

        // Calculate the distance to move it to the center of the target

        const xDistance = targetRect.left - refTarget.left + (targetRect.width / 2) - (refTarget.width / 2);
        const yDistance = targetRect.top - refTarget.top + (targetRect.height / 2) - (refTarget.height / 2);
        // console.log(xDistance, yDistance)
        // add some top to the yDistance
        deltaY = deltaY + targetRect.height / 2;
        deltaX = deltaX + targetRect.width / 2 - movingRect.width / 2;

        // replace movingRects with refTarget with pure css
        refTarget.current.style.position = 'absolute';
        refTarget.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        refTarget.current.style.transition = 'all 0.3s ease-in-out';
        // once the animation is complete, remove the animation and fade out the card
        setTimeout(() => {
            refTarget.current.style.transform = 'translate(0px, 0px)';
            refTarget.current.style.transition = 'none';
            // move back to initial position
            refTarget.current.style.position = 'absolute';
            refTarget.current.style.transform = `translate(${initialPosition.x}px, ${initialPosition.y}px)`;
            refTarget.current.style.transition = 'none';
            // 
            // console.log(cardsDealtsRef.current)

            resolve();
        }, 300);
    })

};


  const dealHands = async () => {
    if (isDealtRef.current || isDealingRef.current) return

    console.log('[DEAL HANDS]')
    setshowDeck(true)
    setIsDealt(false)
    setIsDealing(true)

    const joined =  seatsRef.current.filter(x => x.user != null)

    setTimeout(async () => {
        let i = 0
        for (let j of joined) {

            const index = i
            let targetRef = seatRefs.current[index];
            let refForCard = cardDealRefs.current[i]
            let refForCard2 = cardDealRefs.current[i+1]

            await moveToTarget(targetRef, refForCard)
            setSeats(() => {
              return seatsRef.current.map(x => {
                return {
                  ...x,
                  card1Dealt: true
                }
              })
            })

            await sleep(100)

            await moveToTarget(targetRef, refForCard2)
            setSeats(() => {
              return seatsRef.current.map(x => {
                return {
                  ...x,
                  card2Dealt: true
                }
              })
            })
            i++
        }

        setIsDealt(true);
        setshowDeck(false);
        setIsDealing(false)
    }, 1000)

}


  async function getTable(chain_id, token_address, id) {
    setLoading(true)
    const [er, data] = await getPokerTable({ chain_id, token_address, id })
    setLoading(false)

      if (er) {
          console.error("[GET Table]", er)
          return null
      }

      console.log("[GET Table]", data)
      setTable(data)
  }

  const getMySeat = () => {
    return seatsRef.current.find(x => x.isMe)
  }

  const isMySeat = (seat) => {
    const me = getMySeat()
    if (!me) return false
    return me.seat === seat
  }

  function showSitWindow(i = null) {
    const seat = i !== null ? i : getFreeSeat()
    setSeatToJoin(seat)
  }

  function canJoin() {
    return (user && user?.wallet_address) && !seatsRef.current.some(x => x.isMe)
  }

  function getFreeSeat() {
    return seatsRef.current.find(x => x.status === "free")?.seat
  }

  function sitDown() {
    const seat = seatToJoin
    console.log('[ADD SEAT]', seat)
    sock.current.emit('poker:sitDown', {
      seat,
      bet: table.buy_in_min
    })
    setSeatToJoin(-1)
  }

  const initRoom = (chain_id, token_address, id) => {
    getTable(chain_id, token_address, id)
  }

  const onError = (err) => {
    devLog("[GAME:ERR]", err)
  }

  const onEvent = (event, data) => {
    devLog(`[${event}]`, data)
  }

  const onPrompt = (data) => {
    setSeats(() => {
      return seatsRef.current.map(x => {
        const updt = x.seat === data.seat
        if (!updt) return {...x, promptTime: 0}

        return {
          ...x,
          promptTime: data.time,
          action: null
        }
      })
    })
  }


  const onAct = () => {}

  const onAction = (data) => {
    const act = {
      "check": "checked!",
      "bet": "placed bet!",
      "call": "called!",
      "fold": "folded!"
    }

    const action = act[data?.action] || data?.action + "ed!"
    const person = isMySeat(data?.seat)? "You" : `Player ${data.seat + 1}`
    const msg = `${person} ${action}`
    toast.success(msg, toastOpts)

    setSeats(() => {
      return seatsRef.current.map(x => {
        const updt = x.seat === data.seat
        if (!updt) return x

        return {
          ...x,
          action: data.action
        }
      })
    })
  }

  function toCardId({ rank, suit }) {
    let r = rank.toUpperCase()
    let s = suit[0].toUpperCase()
    r = r === "T" ? "10" : r
    return `${r}${s}`
  }

  const onHand = (data) => {
    setSeats(() => {
      return seatsRef.current.map(x => {
        const updt = x.seat === data.seat
        if (!updt) return x

        return {
          ...x,
          hand: data.hand.map(x => {
            return {
              ...x,
              id: toCardId(x)
            }
          })
        }
      })
    })
  }

  const onSitDown = () => {}

  const leaveTable = () => {
    if (!confirm('Are you sure you want to leave the table?')) return
    console.log('[CMD:STANDUP]', user?.wallet_address)
    sock.current.emit('poker:standUp')
}

  const onSeats = (data) => {
    // Initial data
    if (!seatsRef.current.length) {
      setSeats(() => data.seats.map(x => (
        {
          ...x, 
          isMe: x.user?.wallet_address === user?.wallet_address,
          isWinner: false,
          hand: [],
          card1Dealt: false,
          card2Dealt: false,
          action: null,
          promptTime: 0
        })
    ))
      return
    }

    // Update
    setSeats(() => {
      return seatsRef.current.map(x => {
        const updt = data.seats.find(d => d.seat === x.seat)
        if (!updt) return x

        const left = updt.status == "left"

        return {
          ...x,
          ...updt,
          isMe: updt.user?.wallet_address === user?.wallet_address,
          ...left ? {
            user: null,
            isWinner: false,
            hand: [],
            card1Dealt: false,
            card2Dealt: false,
            action: null,
            promptTime: 0
          } : {}
        }
      })
    })
  }

  const onStand = () => {}

  const onRound = (data) => {
    setCommunityCards(data.communityCards.map(x => {
      return {
        ...x,
        id: toCardId(x)
      }
    }))
    setPot(data.pot.size * 1)
    setRound(data)

    if (round?.round !== data.round) {
      const msg = `Here comes the ${data.round}`
      setRoundMessage(msg)
    }

    // Reset
    if (data.round == "preflop" && endedRef.current) {
      setIsDealt(false)
      setSeats(() => {
        return seatsRef.current.map(x => {
          return {
            ...x,
            card1Dealt: false,
            card2Dealt: false,
            hand: [],
            action: null,
            promptTime: 0
          }
        })
      })
    }

    if (isDealt) return

    if (data.round != "preflop") {
      setIsDealt(true)
      setIsDealing(false)
      setSeats(() => {
        return seatsRef.current.map(x => {
          return {
            ...x,
            card1Dealt: true,
            card2Dealt: true
          }
        })
      })
    } else {
      dealHands()
    }
  }

  const onWinners = (data) => {
    setEnded(true)
  }

  const onCountdown = () => {}

  const toastOpts= { theme: "colored", closeButton: false, progress: false, position: "bottom-right" }

  // Socket
  useEffect(()=> {
    if (!table || sock.current !== null) return

    const { room } = router.query
    const token = userAuth?.token

    sock.current = io("wss://staging.gambly.io", {
        path: "/poker-api",
        transports: ["websocket"],
        query: { room },
        ...token ? {auth: { token }} : {},
    })

    sock.current.on("connect", () => {
        setConnected(true)
        console.log("connected to room:", room);
        toast.success("Connected to room!", toastOpts)
    })

    sock.current.on("connect_error", (err) => {
        console.error(err);
        setConnected(false)
        toast.error("Disconnected!", toastOpts)
    })

    sock.current.on("game:error", data => onError(data))
    sock.current.onAny((event, data) => onEvent(event, data))

    sock.current.on("poker:act", data => onAct(data))
    sock.current.on("poker:action", data => onAction(data))
    sock.current.on("poker:countdown", data => onCountdown(data))
    sock.current.on("poker:hand", data => onHand(data))
    sock.current.on("poker:prompt", data => onPrompt(data))
    sock.current.on("poker:round", data => onRound(data))
    sock.current.on("poker:seats", data => onSeats(data))
    sock.current.on("poker:sitDown", data => onSitDown(data))
    sock.current.on("poker:standUp", data => onStand(data))
    sock.current.on("poker:winners", data => onWinners(data))

    console.log("[Socket setup!]")

    return () => {
        sock.current.close();
        sock.current.disconnect();
    }
  }, [table])

  useEffect(() => {
    devLog('[Seats Changed]', seats)
    setPlayers(seats.filter(x => x.status === "playing"))

  }, [seats])

  useEffect(() => {
    if (!router.isReady) return
    const { network, room, token } = router.query
    initRoom(convertNetworkNameToId(network), token, room)
  }, [router.isReady])

  return (
    <div class="relative h-[calc(100vh-80px)] p-4">
      <Head>
        <title>Play Poker {token ? `using ${token?.name}` : ''}- Gambly</title>
      </Head>
      { loading && <LoadingSmall className="absolute h-full w-full" /> }

      { !loading &&

      <div className="relative w-full h-full  flex flex-col gap-4">
        <div className="flex-1 relative">
        <div className='absolute z-50 top-2 right-2 w-[100px]'>
                    {
                        getMySeat() && 
                        <div className="flex flex-col h-full w-full flex-grow">
                            <div onClick={() => {
                                leaveTable();
                            }} className=" p-1 h-full flex-col-reverse text-sm text-center w-full gap-1 font-extrabold italic flex  items-center justify-center bg-primary text-darkgray hover:opacity-75 cursor-pointer select-none rounded-md">
                                <span>Stand Up</span>
                                <Iconify icon="mingcute:exit-fill" className="text-xl" />
                            </div>
                        </div>
                    }
                </div>


          <div className="absolute flex gap-2 items-center">
              <div className="relative">
                  <CountdownCircleTimer
                      strokeWidth={2}
                      trailColor="#20212d"
                      size={26}
                      isPlaying
                      strokeLinecap="butt"
                      duration={roundTimer}
                      colors={['#FFA843', '#FFA843', '#CC3E3E', '#20212d']}
                      colorsTime={[7, 5, 2, 0]}
                      className={`${roundTimer ? '' : 'hidden'}`}
                  >
                  </CountdownCircleTimer>
                  <div className={`${connected ? 'bg-green' : 'bg-red animate-pulse'} absolute inset-0 m-auto h-[15px] w-[15px] rounded-full`}></div>
              </div>
              <span className="uppercase font-bold text-[10px]">{connected ? round?.round : 'Connecting...'}</span>
          </div>

          <div className="relative rounded-full linear-gradient-dark  border-[24px] border-x-primary border-y-darkgray w-full h-full max-h-full max-w-[1000px] mx-auto">
             <div className={`z-10 absolute poker-table poker-table-${table.max_players}`}>
             {
                                        (() => {
                                            let n = 0
                                            let mySeatNeedsMoving = seatsRef.current.findIndex(x => x.isMe) > 0

                                            return seatsRef.current.map((seat, index) => {
                                                let i = index

                                                if (mySeatNeedsMoving) {
                                                    if (seat.isMe) {
                                                        i = 0
                                                        n = 1
                                                    } else {
                                                        i = (index + 1) - n
                                                    }
                                                } 

                                                return <Seat
                                                    key={index} 
                                                    tableIndex={i}
                                                    seatRef={seatRefs.current[i]}
                                                    token={token}
                                                    {...seat}
                                                />
                                            })
                                        })()
                                    }
            </div>


            <div className="absolute z-0 flex flex-col justify-center items-center h-full w-full left-0 top-0 ">


                <div className={`${showDeck ? 'visible' : 'hidden'} transition-all absolute bottom-[200px] h-16 z-[50] left-0 right-0 m-auto w-[100px] flex items-center text-center justify-center`}>
                  {cardDealRefs.current.map((cardRef, index) => (
                      <img
                        key={index}
                        ref={cardRef}
                        src={'/cards/set1/gray_back.png'}
                        className="absolute h-[40px] w-auto animate-pulse"
                        alt=""
                      />
                  ))}
              </div>
                <div>
                { roundMessage && 
                  <RoundMessage message={roundMessage} onClose={()=> setRoundMessage(null)}/>
                }
                </div>

                                    {
                                      pot && 
                                      <div className='flex gap-1 border border-lightgray bg-darkgray !h-10 items-center justify-center px-4 rounded-xl'>
                                      <span className="text-primary">POT</span>
                                      <span className="opacity-50">:</span>
                                      {formatUnits(pot, table.casino.token.decimals)}
                                      {/* <img src={table.casino.token.logo.includes('http') ? table.casino.token.logo : '/placeholder.png'} className="h-6 w-6"></img> */}
                                  </div>
                                    }
              
                <CommunityCards cards={communityCards} />
            </div>

            {
              seatToJoin >= 0 &&
              <div className="absolute rounded-full top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-sm z-[60]" >
                                        <div className="flex relative  bg-darkgray border-4 border-lightgray rounded-md p-4 items-center justify-center">
                                            <div onClick={() => {
                                                setSeatToJoin(-1)
                                            }} className='absolute top-2 hover:opacity-90 cursor-pointer bg-lightgray p-1 w-[30px] rounded-full flex items-center justify-center right-2 z-50 text-whitegrey'>X</div>
                                            <div className="text-white">
                                                <div className="text-center">
                                                    <div className="text-2xl">Sit at table</div>

                                                    <div className='text-xs rounded-md mt-2 bg-gray'>
                                                        Balance: {formatUnits(tokenBalance?.balance, token?.decimals)} {token?.symbol}
                                                    </div>

                                                    {(formatUnits(tokenBalance?.balance, table.casino.token.decimals) >= formatUnits(table.buy_in_min, table.casino.token.decimals)) ?
                                                        <Button
                                                          size="sm"
                                                          variant="primary"
                                                          onClick={() => sitDown()}
                                                          className={`mt-2 ${formatUnits(tokenBalance, table.casino.token.decimals) < formatUnits(table.buy_in_min, table.casino.token.decimals) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                        > Buy In: {formatUnits(table.buy_in_min, table.casino.token.decimals)} {table.casino.token.symbol}
                                                        </Button>

                                                        :
                                                        <>
                                                            <div className="text-xs text-red mt-2">You do not have enough {table.casino.token.symbol} to join this table.</div>
                                                            <Button
                                                              size='sm'
                                                              variant='primary'
                                                              onClick={() => setShowDepositModal(true)}
                                                              className="mt-2">Deposit More {table.casino.token.symbol}
                                                            </Button>
                                                            <div className="text-xs mt-2">Minimum buy in: {formatUnits(table.buy_in_min, table.casino.token.decimals) || 0} {table.casino.token.symbol}</div>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
              </div>
            }

            <AnimatePresence>
              { table && table?.ended == null && playersRef.current.length < 2 &&
                  <motion.div
                      initial= {{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                      animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-dark-700 text-sm flex ${canJoin() ? 'flex-col': ''} items-center gap-2 p-4 rounded-xl absolute z-[55] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                  >
                    <svg className="text-primary text-xl" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/><rect width="2" height="7" x="11" y="6" fill="currentColor" rx="1"><animateTransform attributeName="transform" dur="22.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect><rect width="2" height="9" x="11" y="11" fill="currentColor" rx="1"><animateTransform attributeName="transform" dur="1.875s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></rect></svg>
                    <div className="text-center">At least 2 players needed to start game...</div>
                    { canJoin() && 
                        <button
                            onClick={ () => showSitWindow() }
                            className="mt-2 text-dark bg-secondary py-1 px-6 rounded-md hover:bg-secondary-400"
                        >Sit Down</button>
                    }
                  </motion.div>
              }
          </AnimatePresence>
          </div>
        </div>


        <div className="h-[60px] bg-red">

        </div>
      </div>

      }
    </div>
  )
}

export default Poker;